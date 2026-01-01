import userRepo from "../repositories/user.repository.js";

import { comparePassword, hashPassword, validatePassword } from "../utils/password.helper.js";
import { createToken, verifyToken } from "../utils/jwt.helper.js";
import { isOneMonthAway } from "../utils/date.helper.js";

import MESSAGES from "../constants/messages.js";

import { CustomError } from "../middlewares/errorHandler.js";


export const signup = async (userInput) => {
    const { name, email, password, passwordConfirmation } = userInput;

    if (!name || !email || !password || !passwordConfirmation) throw new CustomError(MESSAGES.AUTH.MISSING_FIELDS);
    if (password !== passwordConfirmation) throw new CustomError(MESSAGES.AUTH.PASSWORDS_DO_NOT_MATCH);

    const passwordIsValidate = validatePassword(password);
    if (!passwordIsValidate) throw new CustomError(MESSAGES.AUTH.PASSWORD_INVALID);

    const isUserExisting = await userRepo.fastReadUserByEmail(email);
    if (isUserExisting) throw new CustomError(MESSAGES.AUTH.EMAIL_ALREADY_USED);

    return userRepo.createUser({ name, email, password });
}

export const login = async (credentials) => {
    const { email, password } = credentials;
    if (!email || !password) throw new CustomError(MESSAGES.AUTH.MISSING_FIELDS);

    const user = await userRepo.readUserByEmail(email);
    if (!user) throw new CustomError(MESSAGES.AUTH.INVALID_CREDENTIALS);

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw new CustomError(MESSAGES.AUTH.INVALID_CREDENTIALS);

    const payload = user.toObject();
    delete payload.passwordHash;
    const token = createToken(payload);
    return { user, token };
}

export const parseUser = async (user) => {
    return {
        ...user,
        id: user._id,
        isOneMonthAway: isOneMonthAway(user.membershipExpirationDate)
    };
}

export const authUser = (token) => {
    if (!token) throw new CustomError(MESSAGES.AUTH.INVALID_CREDENTIALS);

    const payload = verifyToken(token);
    return payload;
}

export const updateUser = async (userData) => {
    const { userId, updates } = userData;
    if (updates.email) {
        const isUserExisting = await userRepo.fastReadUserByEmail(updates.email);
        if (isUserExisting) throw new CustomError(MESSAGES.AUTH.EMAIL_ALREADY_USED);
    }

    if (updates.newPassword && updates.newPasswordConfirmation) {
        if (updates.newPassword !== updates.newPasswordConfirmation)
            throw new CustomError(MESSAGES.AUTH.PASSWORDS_DO_NOT_MATCH);

        const passwordIsValidate = validatePassword(updates.newPassword);
        if (!passwordIsValidate) throw new CustomError(MESSAGES.AUTH.PASSWORD_INVALID);
        updates.passwordHash = hashPassword(updates.newPassword);
    }

    const updatedUser = await userRepo.updateUserProfile(userId, updates);
    if (!updatedUser) {
        throw new CustomError(MESSAGES.USER.NOT_FOUND);
    }
    const payload = updatedUser.toObject();
    const token = createToken(payload);
    return { updateUser, token };
}