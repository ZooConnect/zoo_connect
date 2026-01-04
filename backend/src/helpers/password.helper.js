import bcrypt from "bcrypt";

const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);


export const comparePassword = async (password, userPasswordHash) => bcrypt.compare(password, userPasswordHash);

export const hashPassword = async (password) => bcrypt.hash(password, saltRounds);

export const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    return password.length > minLength && hasUpperCase && hasDigit;
};