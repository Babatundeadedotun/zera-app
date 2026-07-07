import { v2 as cloudinary } from 'cloudinary';

// .trim() guards against a very common copy/paste mistake: an accidental
// trailing space or newline after pasting the key/secret into .env, which
// causes Cloudinary to reject the request with "Invalid Signature" even
// though the credentials look correct.
const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();

if (!cloudName || !apiKey || !apiSecret) {
  console.warn(
    '\n[ZERA XII] One or more Cloudinary env vars are missing (CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET).\n' +
      'Product image uploads WILL fail until these are set correctly in server/.env.\n'
  );
} else {
  console.log(`[ZERA XII] Cloudinary configured for cloud "${cloudName}"`);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// Actively verifies the credentials work by pinging Cloudinary's API,
// instead of only finding out when the admin's first upload fails.
export async function verifyCloudinaryConnection() {
  if (!cloudName || !apiKey || !apiSecret) return;

  try {
    await cloudinary.api.ping();
    console.log('[ZERA XII] Cloudinary credentials verified successfully.');
  } catch (err) {
    console.error(
      '\n[ZERA XII] ⚠ Cloudinary credentials failed verification: ' +
        (err?.message || err) +
        '\nDouble-check CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET in server/.env ' +
        '(re-copy them fresh from your Cloudinary Dashboard - no extra spaces or quotes).\n'
    );
  }
}

export default cloudinary;
