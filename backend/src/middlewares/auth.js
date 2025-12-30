import * as userService from "../services/user.service.js";

import { verifyToken } from "../utils/jwt.helper.js";
import { respond } from "../utils/response.helper.js";

import MESSAGES from "../constants/messages.js";

export default async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return respond(res, MESSAGES.AUTH.INVALID_CREDENTIALS);

  try {
    const payload = verifyToken(token);
    const user = await userService.findUserByEmail(payload.email);
    if (!user) return respond(res, MESSAGES.USER.NOT_FOUND);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error });
  }
};