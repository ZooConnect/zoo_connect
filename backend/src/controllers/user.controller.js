import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

import Utils from "../utils/utils.js";
import MESSAGES from "../constants/messages.js";

import User from "../models/user.model.js";

const SALT_ROUNDS = 10;
const JWT_SECRET = 'RANDOM_TOKEN_SECRET';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, password_confirmation } = req.body;

    if (!name || !email || !password || !password_confirmation)
      return res.status(400).json({ message: MESSAGES.AUTH.MISSING_FIELDS });
    if (password !== password_confirmation)
      return res.status(400).json({ message: MESSAGES.AUTH.PASSWORDS_DO_NOT_MATCH });

    const passError = Utils.validatePassword(password);
    if (passError) return res.status(400).json({ message: MESSAGES.AUTH.PASSWORD_INVALID });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: MESSAGES.AUTH.EMAIL_ALREADY_USED });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, password_hash: hash });
    res.status(201).json({ message: MESSAGES.AUTH.ACCOUNT_CREATED_SUCCESS, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: MESSAGES.AUTH.MISSING_FIELDS });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: MESSAGES.AUTH.INVALID_CREDENTIALS });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: MESSAGES.AUTH.INVALID_CREDENTIALS });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: MESSAGES.AUTH.LOGIN_SUCCESS, token });
  } catch (err) {
    next(err);
  }
};
/*
export async function updateUser(req, res, next) {
  try {
    const userId = req.params.id;
    const updates = req.body;

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password"); // Security: Remove password from response

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    // Jira: "Rejet des données ... e-mails déjà utilisés"
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already in use" });
    }
    next(error);
  }
}

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