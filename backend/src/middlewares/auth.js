import jwt from 'jsonwebtoken';

import User from "../models/user.model.js";

import MESSAGES from "../constants/messages.js";

export default async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send(MESSAGES.AUTH.INVALID_CREDENTIALS);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-passwordHash");
    if (!user) return res.status(401).send();

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error });
  }
};