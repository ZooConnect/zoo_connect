import * as userService from "../services/user.service.js";

import { respond } from "../utils/response.helper.js";
import { comparePassword, hashPassword, validatePassword } from "../utils/password.helper.js";
import { createToken } from "../utils/jwt.helper.js";
import { createCookie, clearCookie } from "../utils/cookie.helper.js";

import MESSAGES from "../constants/messages.js";


export const signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirmation } = req.body;

    if (!name || !email || !password || !passwordConfirmation)
      return respond(res, MESSAGES.AUTH.MISSING_FIELDS);
    if (password !== passwordConfirmation)
      return respond(res, MESSAGES.AUTH.PASSWORDS_DO_NOT_MATCH);

    const passwordIsValidate = validatePassword(password);
    if (!passwordIsValidate) return respond(res, MESSAGES.AUTH.PASSWORD_INVALID);

    const isUserExisting = await userService.isUserExisting(email);
    if (isUserExisting) return respond(res, MESSAGES.AUTH.EMAIL_ALREADY_USED);

    const user = await userService.registerUser({ name, email, password });
    respond(res, MESSAGES.AUTH.ACCOUNT_CREATED_SUCCESS, { user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return respond(res, MESSAGES.AUTH.MISSING_FIELDS);

    const user = await userService.findUserByEmail(email);
    if (!user) return respond(res, MESSAGES.AUTH.INVALID_CREDENTIALS);

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) return respond(res, MESSAGES.AUTH.INVALID_CREDENTIALS);

    const payload = {
      id: user._id || user.id,
      email: user.email,
      name: user.name
    };
    const token = createToken(payload);
    createCookie(res, token);

    respond(res, MESSAGES.AUTH.LOGIN_SUCCESS, {
      id: user._id,
      name: user.name
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  clearCookie(res);
  respond(res, MESSAGES.AUTH.LOGOUT_SUCCESS);
}

export const getMe = (req, res) => {
  // req.user est injecté par authMiddleware
  respond(res, MESSAGES.USER.FOUND, {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
}

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    if (updates.email) {
      const isUserExisting = await userService.isUserExisting(updates.email);
      if (isUserExisting) return respond(res, MESSAGES.AUTH.EMAIL_ALREADY_USED);
    }

    if (updates.newPassword && updates.newPasswordConfirmation) {
      if (updates.newPassword !== updates.newPasswordConfirmation)
        return respond(res, MESSAGES.AUTH.PASSWORDS_DO_NOT_MATCH);

      const passwordIsValidate = validatePassword(updates.newPassword);
      if (!passwordIsValidate) respond(res, MESSAGES.AUTH.PASSWORD_INVALID);
      updates.passwordHash = hashPassword(updates.newPassword);
    }

    const updatedUser = await userService.modifyUser(userId, updates);
    if (!updatedUser) {
      return respond(res, MESSAGES.USER.NOT_FOUND);
    }

    respond(res, MESSAGES.USER.VALID_MODIFICATION);
  } catch (error) {
    next(error);
  }
}

/*
export async function getMembership(req, res, next) {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return only the membership details
    res.status(200).json({
      membership_type: user.membership_type,
      expiration_date: user.expiration_date,
      status: user.status,
    });
  } catch (error) {
    next(error);
  }
}*/