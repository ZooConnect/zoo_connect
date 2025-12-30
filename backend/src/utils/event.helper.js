
// src/utils/events.js

/**
 * Validates query parameters for event filtering
 * @param {Object} query - Query parameters from request
 * @returns {Object} Validation result with valid flag and message
 */
export function validateEventQueryParams(query) {
    const { date, type } = query;

    // Validate date format if provided
    if (date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return {
                valid: false,
                message: 'Invalid date format. Use YYYY-MM-DD format.'
            };
        }
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return {
                valid: false,
                message: 'Invalid date value.'
            };
        }
    }

    // Validate event type if provided
    if (type) {
        const validTypes = ['feeding', 'show', 'workshop', 'tour', 'special', 'conservation'];
        if (!validTypes.includes(type.toLowerCase())) {
            return {
                valid: false,
                message: `Invalid event type. Valid types: ${validTypes.join(', ')}`
            };
        }
    }

    return { valid: true };
}

/**
 * Validates event data for creation/update
 * @param {Object} data - Event data to validate
 * @returns {Object} Validation result with valid flag and message
 */
export function validateEventData(data) {
    const { title, start_date, end_date, type } = data;

    // Required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return {
            valid: false,
            message: 'Title is required and must be a non-empty string'
        };
    }

    if (!start_date) {
        return {
            valid: false,
            message: 'start_date is required'
        };
    }

    if (!end_date) {
        return {
            valid: false,
            message: 'end_date is required'
        };
    }

    // Validate dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate.getTime())) {
        return {
            valid: false,
            message: 'Invalid start_date value'
        };
    }

    if (isNaN(endDate.getTime())) {
        return {
            valid: false,
            message: 'Invalid end_date value'
        };
    }

    if (endDate <= startDate) {
        return {
            valid: false,
            message: 'end_date must be after start_date'
        };
    }

    // Validate type if provided
    if (type) {
        const validTypes = ['feeding', 'show', 'workshop', 'tour', 'special', 'conservation'];
        if (!validTypes.includes(type.toLowerCase())) {
            return {
                valid: false,
                message: `Invalid event type. Valid types: ${validTypes.join(', ')}`
            };
        }
    }

    return { valid: true };
}

/**
 * Builds MongoDB filter for event queries
 * @param {Object} query - Query parameters (date, type)
 * @param {Date} now - Current date (for testing purposes)
 * @returns {Object} MongoDB filter object
 */
export function buildEventFilter(query, now = new Date()) {
    const { date, type } = query;

    // default: include ongoing + upcoming (hasn't finished yet)
    const filter = { status: "active", end_date: { $gte: now } };

    if (date) {
        const day = new Date(date);
        const startOfDay = new Date(day);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(day);
        endOfDay.setHours(23, 59, 59, 999);

        // overlap the chosen day
        filter.start_date = { $lte: endOfDay };
        filter.end_date = { $gte: startOfDay };
    }

    if (type) filter.type = type.toLowerCase();

    return filter;
}
