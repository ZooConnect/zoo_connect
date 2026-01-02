import * as usersService from "../../services/admin/users.service.js";

import { buildUserForCreation, buildUserFilter } from "../../utils/admin/users.helper.js";

import { respond } from "../../utils/response.helper.js";

import MESSAGES from '../../constants/messages.js';

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