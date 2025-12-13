import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const SALT_ROUNDS = 10;
const JWT_SECRET = 'ton_secret_jwt'; // à remplacer

const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  if (password.length < minLength || !hasUpperCase || !hasDigit) {
    return "The password must contain at least 8 characters, an uppercase letter and a digit.";
  }
  return null;
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, password_confirmation } = req.body;
    if (!name || !email || !password || !password_confirmation)
      return res.status(400).json({ message: "All fields are required." });
    if (password !== password_confirmation)
      return res.status(400).json({ message: "Passwords do not match." });
    const passError = validatePassword(password);
    if (passError) return res.status(400).json({ message: passError });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "This email is already used." });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, password_hash: hash });

    res.status(201).json({ message: "Account created successfully!", user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields are required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Wrong email or password." });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Wrong email or password" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: "Succesfull connexion!", token });
  } catch (err) {
    next(err);
  }
};
