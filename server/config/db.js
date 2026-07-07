import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error(
      '\n[ZERA XII] Missing MONGODB_URI in your .env file. Copy .env.example to .env and fill it in.\n'
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('[ZERA XII] Connected to MongoDB');
  } catch (err) {
    console.error('[ZERA XII] MongoDB connection failed:', err.message);
    process.exit(1);
  }
}
