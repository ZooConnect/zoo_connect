import * as userService from "../services/user.service.js";

import { createCookie, clearCookie, respond } from "../utils/response.helper.js";
import { comparePassword, hashPassword, validatePassword } from "../utils/password.helper.js";
import { createToken } from "../utils/jwt.helper.js";
import { isOneMonthAway } from "../utils/date.helper.js";

import MESSAGES from "../constants/messages.js";

import { CustomError } from "../middlewares/errorHandler.js";


export const signup = async (req, res, next) => {
    try {
        const { name, email, password, passwordConfirmation } = req.body;

        if (!name || !email || !password || !passwordConfirmation)
            return next(new CustomError(MESSAGES.AUTH.MISSING_FIELDS));
        if (password !== passwordConfirmation)
            return next(new CustomError(MESSAGES.AUTH.PASSWORDS_DO_NOT_MATCH));

        const passwordIsValidate = validatePassword(password);
        if (!passwordIsValidate) return next(new CustomError(MESSAGES.AUTH.PASSWORD_INVALID));

        const isUserExisting = await userService.isUserExisting(email);
        if (isUserExisting) return next(new CustomError(MESSAGES.AUTH.EMAIL_ALREADY_USED));

        const user = await userService.registerUser({ name, email, password });
        respond(res, MESSAGES.AUTH.ACCOUNT_CREATED_SUCCESS, { user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return next(new CustomError(MESSAGES.AUTH.MISSING_FIELDS));

        const user = await userService.findUserByEmail(email);
        if (!user) return next(new CustomError(MESSAGES.AUTH.INVALID_CREDENTIALS));

        const valid = await comparePassword(password, user.passwordHash);
        if (!valid) return next(new CustomError(MESSAGES.AUTH.INVALID_CREDENTIALS));

        const payload = user.toObject();
        delete payload.passwordHash;
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

export const logout = (req, res, next) => {
    try {
        clearCookie(res);
        respond(res, MESSAGES.AUTH.LOGOUT_SUCCESS);
    } catch (err) {
        next(err);
    }
}

export const getUser = async (req, res, next) => {
    try {
        // req.user est injecté par authMiddleware
        respond(res, MESSAGES.USER.FOUND, {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            membershipType: req.user.membershipType,
            membershipExpirationDate: req.user.membershipExpirationDate,
            membershipStatus: req.user.membershipStatus,
            isOneMonthAway: isOneMonthAway(req.user.membershipExpirationDate)
        });
    } catch (err) {
        next(err);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const updates = req.body;

        if (updates.email) {
            const isUserExisting = await userService.isUserExisting(updates.email);
            if (isUserExisting) return next(new CustomError(MESSAGES.AUTH.EMAIL_ALREADY_USED));
        }

        if (updates.newPassword && updates.newPasswordConfirmation) {
            if (updates.newPassword !== updates.newPasswordConfirmation)
                return next(new CustomError(MESSAGES.AUTH.PASSWORDS_DO_NOT_MATCH));

            const passwordIsValidate = validatePassword(updates.newPassword);
            if (!passwordIsValidate) return next(new CustomError(MESSAGES.AUTH.PASSWORD_INVALID));
            updates.passwordHash = hashPassword(updates.newPassword);
        }

        const updatedUser = await userService.modifyUser(userId, updates);
        if (!updatedUser) {
            return next(new CustomError(MESSAGES.USER.NOT_FOUND));
        }
        const payload = updatedUser.toObject();
        const token = createToken(payload);
        createCookie(res, token);
        respond(res, MESSAGES.USER.VALID_MODIFICATION, updatedUser);
    } catch (error) {
        next(error);
    }
}