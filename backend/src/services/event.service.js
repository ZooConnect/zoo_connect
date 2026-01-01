import eventRepo from "../repositories/event.repository.js";

// le service = logique métier

export const findEventById = async (id) => eventRepo.readEventById(id);

export const findEvents = async () => eventRepo.readEvents();

export const findOngoingEvents = async (now = new Date()) => eventRepo.readOngoingEvents(now);

export const findPastEvents = async (now = new Date()) => eventRepo.readPastEvents(now);

export const findUpcomingEvents = async (now = new Date()) => eventRepo.readUpcomingEvents(now);

export const isEventActive = (event) => event.isActive();

export const isEventExisting = async (id) => eventRepo.fastReadEventById(id);

export const isEventPast = (event) => event.isPast();

export const modifyEvent = async (id, updates) => eventRepo.updateEvent(id, updates);

/**
 * Registers a new event.
 * @param {Object} event
 * @param {string} event.title
 * @param {string} event.description
 * @param {Date} event.startDate
 * @param {Date} event.endDate
 * @param {string} event.location
 * @param {Object} [data]
 */
export const registerEvent = async (event, metadata = {}) => eventRepo.createEvent(event, metadata);

export const removeEvent = async (id) => eventRepo.deleteEvent(id);