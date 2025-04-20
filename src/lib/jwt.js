import jwt from 'jsonwebtoken';
import { decryptData, encryptData } from './encripte';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // store in .env
const JWT_EXP = `${process.env.DAY_COOKIE}d` || '100d'; // store in .env

export function signToken(payload) {
  const { encryptedData, iv } = encryptData(JSON.stringify(payload));
  const token = jwt.sign({ data: encryptedData, iv }, JWT_SECRET, { expiresIn: JWT_EXP });
  // return jwt.sign(payload, JWT_SECRET, { expiresIn : JWT_EXP});
  return token;
}

export function verifyToken(token) {
  const decoded = jwt.verify(token, JWT_SECRET);
  const decrypted = decryptData(decoded.data, decoded.iv);

  return JSON.parse(decrypted);
}


export function generateRandomString(length = 16) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result;
}