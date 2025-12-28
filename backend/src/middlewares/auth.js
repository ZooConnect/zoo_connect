import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Not authenticated');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error });
  }
};