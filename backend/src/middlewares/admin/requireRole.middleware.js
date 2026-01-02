import * as usersService from "../../services/admin/users.service.js";

export const requireRole = (minRole) => (req, res, next) => {
    usersService.requireRole(req.user, minRole);
    next();
};
