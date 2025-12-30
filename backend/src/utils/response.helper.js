export const createCookie = (res, token) => {
    // on met le token dans un http-only
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,//process.env.NODE_ENV === "production", //true only in production mode
        sameSite: "lax",
        maxAge: 60 * 60 * 1000 //1h
    });
}

export const clearCookie = (res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    })
}

export const respond = (res, { message, status }, data = {}) => {
    return res.status(status).json({
        message,
        ...data
    });
}