import { authUser } from "../services/user.service.js";

export default (req, res, next) => {
    try {
        const token = req.cookies.token;

        const payload = authUser(token);
        req.user = payload;
        next();
    } catch (error) {
        next(error);
    }
};