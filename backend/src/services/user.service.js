import userRepo from "../repositories/user.repository.js";

import { comparePassword, hashPassword, validatePassword } from "../helpers/password.helper.js";
import { createToken, verifyToken } from "../helpers/jwt.helper.js";
import { isOneMonthAway } from "../helpers/date.helper.js";
import { sendEmail } from "../helpers/email.helper.js";

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

    const passwordHash = await hashPassword(password);
    const created = await userRepo.createUser({ name, email, passwordHash });

    // send welcome email (best-effort)
    try {
        await sendEmail({
            to: email,
            subject: 'Welcome to Zoo Connect',
            text: `Hi ${name},\n\nWelcome to Zoo Connect! Your account has been created successfully.`
        });
    } catch (err) {
        console.error('Failed to send signup email:', err);
    }

    return created;
}

export const login = async (credentials) => {
    const { email, password } = credentials;
    if (!email || !password) throw new CustomError(MESSAGES.AUTH.MISSING_FIELDS);

    const user = await userRepo.readUserByEmail(email);
    if (!user) throw new CustomError(MESSAGES.AUTH.INVALID_CREDENTIALS);

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw new CustomError(MESSAGES.AUTH.INVALID_CREDENTIALS);

    const payload = user;
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
    const { user, updates } = userData;

    if (updates.email && updates.email !== user.email) {
        const isUserExisting = await userRepo.fastReadUserByEmail(updates.email);
        if (isUserExisting) throw new CustomError(MESSAGES.AUTH.EMAIL_ALREADY_USED);
    }

    let passwordChanged = false;
    if (updates.newPassword && updates.newPasswordConfirmation) {
        if (updates.newPassword !== updates.newPasswordConfirmation)
            throw new CustomError(MESSAGES.AUTH.PASSWORDS_DO_NOT_MATCH);

        const passwordIsValidate = validatePassword(updates.newPassword);
        if (!passwordIsValidate) throw new CustomError(MESSAGES.AUTH.PASSWORD_INVALID);
        updates.passwordHash = await hashPassword(updates.newPassword);
        // remove temporary fields
        delete updates.newPassword;
        delete updates.newPasswordConfirmation;
        passwordChanged = true;
    }

    const updatedUser = await userRepo.updateUserProfile(user._id, updates);
    if (!updatedUser) {
        throw new CustomError(MESSAGES.USER.NOT_FOUND);
    }

    const payload = { ...updatedUser.toObject(), id: updatedUser._id };
    const token = createToken(payload);

    // If password changed, send notification email
    if (passwordChanged) {
        try {
            await sendEmail({
                to: updatedUser.email,
                subject: 'Your password was changed',
                text: `Hello ${updatedUser.name},\n\nThis is a confirmation that your account password was changed. If you did not perform this action, please contact support immediately.`
            });
        } catch (err) {
            console.error('Failed to send password change email:', err);
        }
    }

    return { updatedUser, token };
}