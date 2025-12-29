import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

import userRepo from "../repositories/user.repository.js";


const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);

export const comparePassword = async (password, userPasswordHash) => bcrypt.compare(password, userPasswordHash);

export const createCookie = async (res, token) => {
    // on met le token dans un http-only
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,//process.env.NODE_ENV === "production", //true only in production mode
        sameSite: "lax",
        maxAge: 60 * 60 * 1000 //1h
    });
}

export const createToken = (user) => {
    return jwt.sign(
        {
            id: user._id || user.id,
            name: user.name,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' });
}

export const clearCookie = (res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    })
}

export const findUserByEmail = async (email) => userRepo.readUserByEmail(email);

export const hashPassword = async (password) => bcrypt.hash(password, saltRounds);

export const isUserExisting = async (email) => userRepo.fastReadUserByEmail(email);

export const modifyUser = async (id, updates) => userRepo.updateUserProfile(id, updates);

export const registerUser = async ({ name, email, password }) => {
    const passwordHash = await hashPassword(password);
    return userRepo.createUser({ name, email, passwordHash });
}