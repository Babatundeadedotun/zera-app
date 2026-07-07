import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';

export async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const dummyPassword = process.env.ADMIN_DEFAULT_PASSWORD;

  if (!email || !dummyPassword) {
    console.warn(
      '[ZERA XII] ADMIN_EMAIL / ADMIN_DEFAULT_PASSWORD not set - skipping admin seed. See server/.env.example.'
    );
    return;
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    return; // admin account already set up, never overwrite it
  }

  const hashed = await bcrypt.hash(dummyPassword, 10);
  await Admin.create({
    email,
    password: hashed,
    mustResetPassword: true,
  });

  console.log('\n============================================================');
  console.log(' ZERA XII admin account created for the first time.');
  console.log(` Login email:    ${email}`);
  console.log(` Temp password:  ${dummyPassword}`);
  console.log(' She will be required to set a new password on first login.');
  console.log('============================================================\n');
}
