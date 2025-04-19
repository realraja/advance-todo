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
