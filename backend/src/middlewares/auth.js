import jwt from 'jsonwebtoken';
const JWT_SECRET = 'RANDOM_TOKEN_SECRET'; // même clé que dans auth.controller.js

export default (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).send('Non autorisé');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).send('Token invalide ou expiré');
  }
};