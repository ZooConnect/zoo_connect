import * as userService from "../services/user.service.js";

import { respond } from "../utils/response.helper.js";
import { createCookie, clearCookie } from "../utils/response.helper.js";

import MESSAGES from "../constants/messages.js";


export const signup = async (req, res, next) => {
    try {
        const { name, email, password, passwordConfirmation } = req.body;

        const user = await userService.signup({ name, email, password, passwordConfirmation });
        respond(res, MESSAGES.AUTH.ACCOUNT_CREATED_SUCCESS, { user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { user, token } = await userService.login({ email, password });
        createCookie(res, token);
        respond(res, MESSAGES.AUTH.LOGIN_SUCCESS, user);
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

export const parseUser = async (req, res, next) => {
    try {
        const user = req.user;

        const parsedUser = await userService.parseUser(user)
        respond(res, MESSAGES.USER.FOUND, parsedUser);
    } catch (err) {
        next(err);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const updates = req.body;

        const { updatedUser, token } = await userService.updateUser({ userId, updates });
        createCookie(res, token);
        respond(res, MESSAGES.USER.VALID_MODIFICATION, updatedUser);
    } catch (error) {
        next(error);
    }
}