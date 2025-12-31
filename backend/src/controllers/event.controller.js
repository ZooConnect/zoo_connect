import * as eventService from "../services/event.service.js";

import { respond } from "../utils/response.helper.js";

import MESSAGES from "../constants/messages.js";

export const getEvents = async (req, res, next) => {
  try {
    const ongoingEvents = await eventService.findOngoingEvents();
    const upcomingEvents = await eventService.findUpcomingEvents();
    const events = { ...ongoingEvents, ...upcomingEvents };
    respond(res, MESSAGES.EVENT.LOAD_ALL_EVENTS_SUCCESS, events);
  } catch (error) {
    next(error);
  }
}

export const getEventById = async (req, res, next) => {
  const eventId = req.body.id;
}

export const createEvent = async (req, res, next) => {

}

export const updateEvent = async (req, res, next) => {

}

export const deleteEvent = async (req, res, next) => {

}

/**
 * Validates query parameters for event filtering
 * @param {Object} query - Query parameters from request
 * @returns {Object} Validation result with valid flag and message
 */
/*
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
*/
