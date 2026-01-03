import { CustomError } from "../errorHandler.js";

const ROLE_HIERARCHY = {
    admin: 3,
    staff: 2,
    visitor: 1
};

export const requireRole = (minRole) => (req, res, next) => {
    if (!req.user) {
        throw new CustomError("Unauthorized", 401);
    }

    const userRoleLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const minRoleLevel = ROLE_HIERARCHY[minRole] || 0;

    if (userRoleLevel < minRoleLevel) {
        throw new CustomError("Access denied", 403);
    }

    next();
};
