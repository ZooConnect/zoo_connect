import * as usersService from "../../services/admin/users.services.js";

export const requireRole = (minRole) => (req, res, next) => {
    usersService.requireRole(req.user, minRole);
    next();
};
