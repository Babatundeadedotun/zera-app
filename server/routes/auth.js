import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Admin from '../models/Admin.js';
import { sendResetCodeEmail } from '../utils/email.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = express.Router();

function signToken(admin) {
  return jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

function isStrongEnough(password) {
  return typeof password === 'string' && password.length >= 8;
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(admin);

    return res.json({
      token,
      mustResetPassword: admin.mustResetPassword,
      email: admin.email,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// POST /api/auth/set-new-password
// Used both for the forced first-login password change (requires a valid token
// from /login) and for a voluntary password change from the dashboard.
router.post('/set-new-password', requireAdminAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!isStrongEnough(newPassword)) {
      return res.status(400).json({ message: 'New password must be at least 8 characters.' });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin account not found.' });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.mustResetPassword = false;
    admin.resetCodeHash = null;
    admin.resetCodeExpires = null;
    await admin.save();

    // Issue a fresh token so the "mustResetPassword" flag updates client-side too
    const token = signToken(admin);

    return res.json({ message: 'Password updated successfully.', token, mustResetPassword: false });
  } catch (err) {
    console.error('Set new password error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// POST /api/auth/forgot-password
// Generates a 6-digit code, emails it, and stores only its hash + expiry.
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    // Always respond the same way whether or not the email exists, so we don't
    // leak which emails are registered admins.
    const genericResponse = {
      message: 'If that email is registered, a reset code has been sent to it.',
    };

    if (!admin) {
      return res.json(genericResponse);
    }

    const code = crypto.randomInt(100000, 999999).toString();
    admin.resetCodeHash = await bcrypt.hash(code, 10);
    admin.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await admin.save();

    try {
      await sendResetCodeEmail(admin.email, code);
    } catch (emailErr) {
      console.error('Failed to send reset code email:', emailErr);
      return res.status(500).json({
        message:
          'Could not send the reset email. Check the server GMAIL_USER / GMAIL_APP_PASSWORD settings.',
      });
    }

    return res.json(genericResponse);
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// POST /api/auth/verify-reset-code
// Checks the emailed code and, if valid, returns a short-lived reset token
// that authorizes exactly one password reset.
router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin || !admin.resetCodeHash || !admin.resetCodeExpires) {
      return res.status(400).json({ message: 'Invalid or expired code.' });
    }

    if (admin.resetCodeExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: 'This code has expired. Please request a new one.' });
    }

    const isMatch = await bcrypt.compare(code, admin.resetCodeHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid or expired code.' });
    }

    const resetToken = jwt.sign(
      { id: admin._id, email: admin.email, purpose: 'password-reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.json({ resetToken });
  } catch (err) {
    console.error('Verify reset code error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// POST /api/auth/reset-password
// Final step of the "forgot password" flow - takes the resetToken from
// /verify-reset-code plus the new password.
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !isStrongEnough(newPassword)) {
      return res.status(400).json({ message: 'A valid reset token and an 8+ character password are required.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ message: 'This reset link has expired. Please start over.' });
    }

    if (decoded.purpose !== 'password-reset') {
      return res.status(400).json({ message: 'Invalid reset token.' });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin account not found.' });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.mustResetPassword = false;
    admin.resetCodeHash = null;
    admin.resetCodeExpires = null;
    await admin.save();

    return res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// GET /api/auth/me - lets the frontend verify a stored token is still valid
router.get('/me', requireAdminAuth, async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select('email mustResetPassword');
  if (!admin) return res.status(404).json({ message: 'Admin account not found.' });
  return res.json({ email: admin.email, mustResetPassword: admin.mustResetPassword });
});

export default router;
