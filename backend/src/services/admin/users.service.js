import userRepo from "../../repositories/user.repository.js";

import { hashPassword, validatePassword } from "../../helpers/password.helper.js";

import MESSAGES from "../../constants/messages.js";

import { CustomError } from "../../middlewares/errorHandler.js";


export const getAllUsers = async (filter = {}) => {
    return userRepo.readUsers(filter);
}

export const createUser = async (userInput, metadata) => {
    const { name, email, password, passwordConfirmation } = userInput;

    if (!name || !email || !password || !passwordConfirmation) throw new CustomError(MESSAGES.AUTH.MISSING_FIELDS);
    if (password !== passwordConfirmation) throw new CustomError(MESSAGES.AUTH.PASSWORDS_DO_NOT_MATCH);

    const passwordIsValidate = validatePassword(password);
    if (!passwordIsValidate) throw new CustomError(MESSAGES.AUTH.PASSWORD_INVALID);

    const isUserExisting = await userRepo.fastReadUserByEmail(email);
    if (isUserExisting) throw new CustomError(MESSAGES.AUTH.EMAIL_ALREADY_USED);

    const passwordHash = await hashPassword(password);
    return userRepo.createUser({ name, email, passwordHash, ...metadata });
}

export const getUser = async (userId) => {
    const user = await userRepo.readUserById(userId);

    if (!user) throw new CustomError(MESSAGES.USER.NOT_FOUND);
    return user;
}

export const deleteUser = async (userId) => {
    const user = await userRepo.fastreadUserById(userId);
    if (!user) throw new CustomError(MESSAGES.USER.NOT_FOUND);
    return userRepo.deleteUser(userId);
}