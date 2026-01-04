import * as eventService from "../services/event.service.js";

import { respond } from "../helpers/response.helper.js";

import MESSAGES from "../constants/messages.js";

export const getEvents = async (req, res, next) => {
  try {
    const ongoingEvents = await eventService.findOngoingEvents();
    const upcomingEvents = await eventService.findUpcomingEvents();
    const events = [...ongoingEvents, ...upcomingEvents];
    if (events.length === 0) {
      const all = await eventService.findEvents();
      return respond(res, MESSAGES.EVENT.LOAD_ALL_EVENTS_SUCCESS, all);
    }
    respond(res, MESSAGES.EVENT.LOAD_ALL_EVENTS_SUCCESS, events);
  } catch (error) {
    next(error);
  }
}

export const getEventById = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const event = await eventService.findEventById(eventId);
    respond(res, MESSAGES.EVENT.FOUND, event);
  } catch (error) {
    next(error);
  }
}

export const createEvent = async (req, res, next) => {
  try {
    const event = await eventService.registerEvent(req.body);
    respond(res, MESSAGES.EVENT.CREATED_SUCCESS, event);
  } catch (error) {
    next(error);
  }
}

export const updateEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const event = await eventService.modifyEvent(eventId, req.body);
    respond(res, MESSAGES.EVENT.UPDATE_SUCCESS, event);
  } catch (error) {
    next(error);
  }
}

export const deleteEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    await eventService.removeEvent(eventId);
    respond(res, MESSAGES.EVENT.DELETE_SUCCESS);
  } catch (error) {
    next(error);
  }
}