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


// import mongoose from "mongoose"


// const connectDB = async () =>{
//     try {
//         console.log(process.env.DB_URL)
//         const {connection} = await mongoose.connect(process.env.DB_URL,{
//             dbName: process.env.DB_NAME 
//         });
//         console.log('Database connected to ', connection.name);
//     } catch (error) {
//         console.log('err===>',error);
//         process.exit(1);
//     } 
// }

// export default connectDB;