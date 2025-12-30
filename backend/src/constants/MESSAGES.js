export default {
    AUTH: {
        ACCOUNT_CREATED_SUCCESS: { message: 'Account created successfully!', status: 201 },
        LOGIN_SUCCESS: { message: 'Successfully logged in!', status: 200 },
        LOGOUT_SUCCESS: { message: 'Logged out sucessfully', status: 200 },
        INVALID_CREDENTIALS: { message: 'Wrong email or password.', status: 401 },
        MISSING_FIELDS: { message: 'All fields are required.', status: 400 },
        PASSWORD_INVALID: { message: 'The password must contain at least 8 characters, an uppercase letter and a digit.', status: 400 },
        PASSWORDS_DO_NOT_MATCH: { message: 'Passwords do not match.', status: 400 },
        EMAIL_ALREADY_USED: { message: 'This email is already used.', status: 409 },
    },
    USER: {
        FOUND: { message: 'User found.', status: 200 },
        NOT_FOUND: { message: 'User not found.', status: 404 },
        VALID_MODIFICATION: { message: 'User updated sucessfully!', status: 200 }
    },
};