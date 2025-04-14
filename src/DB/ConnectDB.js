import mongoose from 'mongoose';

const MONGODB_URI = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME ;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env');
}
if (!DB_NAME) {
  throw new Error('Please define DB_NAME in .env');
}

let isConnected = false;

export default async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}





// import mongoose from "mongoose"


// export const connectDB = async () =>{
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