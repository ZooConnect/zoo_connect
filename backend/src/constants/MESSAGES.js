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
        VALID_MODIFICATION: { message: 'User updated sucessfully!', status: 200 },
        USERS_FOUND: { message: "Users found.", status: 200 },
        DELETE_SUCCESS: { message: 'Successfully deleted!', status: 200 },
        ACCES_DENIED: { message: "Acced denied! Admin or staff only.", status: 403 }
    },
    EVENT: {
        FOUND: { message: 'Event found.', status: 200 },
        NOT_FOUND: { message: 'Event not found.', status: 404 },
        LOAD_ALL_EVENTS_SUCCESS: { message: "Successfully events loaded!", status: 200 },
        NOT_ACTIVE: { message: 'Target event is not active', status: 400 },
        IS_FINISHED: { message: 'Target event is in the past', status: 400 },

    },
    BOOKING: {
        LOAD_ALL_BOOKINGS_FOR_USER_SUCCESS: { message: "Successfully bookings loaded for user!", status: 200 },
        FOUND: { message: 'Booking found.', status: 200 },
        NOT_FOUND: { message: 'Booking not found.', status: 404 },
        PERMISSION_DENIED_TO_CANCEL: { message: 'You do not have permission to cancel this booking', status: 403 },
        PERMISSION_DENIED_TO_VIEW: { message: 'You do not have permission to view this booking', status: 403 },
        PERMISSION_DENIED_TO_REPROGRAM: { message: 'You do not have permission to reprogram this booking', status: 403 },
        ALREADY_CANCELLED: { message: 'Booking is already cancelled', status: 400 },
        CANCELLED_SUCCES: { message: 'Booking cancelled successfully', status: 200 },
        REPROGRAM_REQUIRES_DATA: { message: 'newDate is required', status: 400 },
        REPROGRAM_SUCCES: { message: 'Booking reprogrammed successfully', status: 200 },
        CANCELLATION_DEADLINE_PASSED: { message: 'Booking can no longer be cancelled.', status: 403 },
        CREATED_SUCCESS: { message: 'Booking created successfully!', status: 201 },
    },
    DATE: {
        INVALID_FORMAT: { message: 'Invalid date format. Expected YYYY-MM-DD.', status: 400 },
        INVALID_VALUE: { message: 'Invalid date value.', status: 400 },
        END_BEFORE_START: { message: 'End date must be after start date.', status: 400 }
    },
    ANIMAL: {
        ANIMALS_FOUND: { message: "Animals found.", status: 200 }
    },
    ADMIN: {
        PERMISSION_DENIED: { message: "Acces denied. It's only for administrator!", status: 403 },
        CREATED_SUCCESS: { message: 'Successfully created user!', status: 200 },
    },
    FEEDING_SCHEDULE: {
        FEEDING_SCHEDULES_FOUND: { message: "Feeding schedules found.", status: 200 },
        UPDATED: { message: "Feeding schedules updated.", status: 200 },
        PERMISSION_DENIED: { message: "Acced denied! Admin or staff only.", status: 403 },
        CREATED_SUCCESS: { message: 'feeding schedule created successfully!', status: 201 },
    },
    STAFF_AVAILABILITY: {
        CREATED_SUCCESS: { message: 'staff availibility created successfully!', status: 201 },
        UPDATED_SUCCES: { message: 'Staff availability updated sucessfully!', status: 200 },
        DELETED_SUCCES: { message: 'Staff availability deleted sucessfully!', status: 200 },
        NOT_FOUND: { message: 'Staff availability not found.', status: 404 },
    }
};