import * as userService from "../services/user.service.js";

import Utils from "../utils/Utils.js";
import MESSAGES from "../constants/messages.js";


export const signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirmation } = req.body;

    if (!name || !email || !password || !passwordConfirmation)
      return res.status(400).json({ message: MESSAGES.AUTH.MISSING_FIELDS });
    if (password !== passwordConfirmation)
      return res.status(400).json({ message: MESSAGES.AUTH.PASSWORDS_DO_NOT_MATCH });

    const passwordIsValidate = Utils.validatePassword(password);
    if (!passwordIsValidate) return res.status(400).json({ message: MESSAGES.AUTH.PASSWORD_INVALID });

    const isUserExisting = await userService.isUserExisting(email);
    if (isUserExisting) return res.status(409).json({ message: MESSAGES.AUTH.EMAIL_ALREADY_USED });

    const user = await userService.registerUser({ name, email, password });
    res.status(201).json({ message: MESSAGES.AUTH.ACCOUNT_CREATED_SUCCESS, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: MESSAGES.AUTH.MISSING_FIELDS });

    const user = await userService.findUserByEmail(email);
    if (!user) return res.status(401).json({ message: MESSAGES.AUTH.INVALID_CREDENTIALS });

    const valid = await userService.comparePassword(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: MESSAGES.AUTH.INVALID_CREDENTIALS });

    const token = userService.createToken(user);
    userService.createCookie(res, token);

    res.status(200).json({
      message: MESSAGES.AUTH.LOGIN_SUCCESS,
      id: user._id,
      name: user.name
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  userService.clearCookie(res);
  res.status(200).json({ message: "Logged out sucessfully" });
}

export const getMe = (req, res) => {
  // req.user est injecté par authMiddleware
  res.status(200).json({
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
      if (isUserExisting) return res.status(409).json({ message: MESSAGES.AUTH.EMAIL_ALREADY_USED });
    }

    if (updates.newPassword && updates.newPasswordConfirmation) {
      if (updates.newPassword !== updates.newPasswordConfirmation)
        return res.status(400).json({ message: MESSAGES.AUTH.PASSWORDS_DO_NOT_MATCH });

      const passwordIsValidate = Utils.validatePassword(updates.newPassword);
      if (!passwordIsValidate) return res.status(400).json({ message: MESSAGES.AUTH.PASSWORD_INVALID });
      updates.passwordHash = userService.hashPassword(updates.newPassword);
    }

    const updatedUser = await userService.modifyUser(userId, updates);
    if (!updatedUser) {
      return res.status(404).json({ error: MESSAGES.USER.NOT_FOUND });
    }

    res.status(200).json({ message: MESSAGES.USER.VALID_MODIFICATION });
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