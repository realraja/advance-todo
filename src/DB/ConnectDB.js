// lib/connectDB.js

import mongoose from 'mongoose';

const MONGODB_URI = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
  throw new Error('Please define DB_URL in .env');
}
if (!DB_NAME) {
  throw new Error('Please define DB_NAME in .env');
}

// Prevent re-connecting
let isConnected = false;

export default async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
    });

    isConnected = true;
    console.log(`✅ MongoDB connected to DB: ${DB_NAME}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
}
