import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { verifyCloudinaryConnection } from './config/cloudinary.js';
import { seedAdmin } from './seedAdmin.js';

const app = createApp();
const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  await verifyCloudinaryConnection();
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`[ZERA XII] API server running on http://localhost:${PORT}`);
  });
}

start();
