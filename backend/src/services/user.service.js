import userRepo from "../repositories/user.repository.js";

import { hashPassword } from "../utils/password.helper.js";

export const findUserByEmail = async (email) => userRepo.readUserByEmail(email);

export const getUserInfo = async (email) => findUserByEmail(email);

export const isUserExisting = async (email) => userRepo.fastReadUserByEmail(email);

export const modifyUser = async (id, updates) => userRepo.updateUserProfile(id, updates);

export const registerUser = async ({ name, email, password }) => {
    const passwordHash = await hashPassword(password);
    return userRepo.createUser({ name, email, passwordHash });
}

export const removeUser = async (userId) => userRepo.deleteUser(userId);