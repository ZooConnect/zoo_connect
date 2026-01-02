import * as eventService from "../services/event.service.js";

import { respond } from "../utils/response.helper.js";

import MESSAGES from "../constants/messages.js";

export const findEvent = async (req, res, next) => {
    try {
        const eventId = req.params.id;
        const event = await eventService.findEventById(eventId);
        if (!event) return respond(res, MESSAGES.EVENT.NOT_FOUND);

        req.event = event;
        next();
    } catch (error) {
        return res.status(401).json({ error });
    }
};