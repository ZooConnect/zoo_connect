import * as usersService from "../../services/admin/users.service.js";

import { respond } from "../../utils/response.helper.js";

import MESSAGES from '../../constants/messages.js';

export const buildUserForCreation = (query) => {
    const userInput = {
        name: query.name,
        email: query.email,
        password: query.password,
        passwordConfirmation: query.passwordConfirmation
    };
    const metadata = {};
    const propsToVerify = ["role", "membershipType", "membershipExpirationDate", "membershipStatus"];

    for (const key of propsToVerify) {
        if (query[key]) metadata[key] = query[key];
    }
    return { userInput, metadata };
};

export const buildUserFilter = (query) => {
    const filter = {};
    const propsToVerify = ["role", "membershipType", "membershipExpirationDate", "membershipStatus"];

    for (const key of propsToVerify) {
        if (query[key]) filter[key] = query[key];
    }
    return filter;
};


export const getAllUsers = async (req, res, next) => {
    try {
        const filter = buildUserFilter(req.query);
        const users = await usersService.getAllUsers(filter);
        respond(res, MESSAGES.USER.USERS_FOUND, users);
    } catch (err) {
        next(err);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const { userInput, metadata } = buildUserForCreation(req.query);
        const user = await usersService.createUser(userInput, metadata);
        respond(res, MESSAGES.ADMIN.CREATED_SUCCESS, user);
    } catch (err) {
        next(err);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await usersService.getUser(userId);
        respond(res, MESSAGES.USER.FOUND, user);
    } catch (err) {
        next(err);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const userId = buildUserForCreation(req.query);
        await usersService.deleteUser(userId);
        respond(res, MESSAGES.USER.DELETE_SUCCESS);
    } catch (err) {
        next(err);
    }
}