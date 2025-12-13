import jwt from 'jsonwebtoken';

const SECRET = 'changeme_supersecret';

export const signToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
