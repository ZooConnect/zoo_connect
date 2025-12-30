export const respond = (res, { message, status }, data = {}) => {
    return res.status(status).json({
        message,
        ...data
    });
}