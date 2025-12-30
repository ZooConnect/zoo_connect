import { verifyToken } from "../utils/jwt.helper.js";
import { respond } from "../utils/response.helper.js";

import MESSAGES from "../constants/messages.js";

export default async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return respond(res, MESSAGES.AUTH.INVALID_CREDENTIALS);

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error });
  }
};