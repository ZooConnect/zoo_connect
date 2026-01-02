import * as usersService from "../../services/admin/users.services.js";

export const requireAdmin = (req, res, next) => {
    const user = req.user;
    usersService.requireAdmin(user);
    next();
};

export const canGetAllUsers = [
    requireAdmin
];

export const canCreateUser = [
    requireAdmin
];

export const canGetUser = [
    requireAdmin
];

export const canDeleteUser = [
    requireAdmin
];