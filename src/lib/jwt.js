import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // store in .env
const JWT_EXP = `${process.env.DAY_COOKIE}d` || '100d'; // store in .env

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn : JWT_EXP});
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
