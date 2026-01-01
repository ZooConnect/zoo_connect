import Event from "../models/event.model.js";

// le repo = accès bdd, point

const createEvent = async (event, metadata = {}) => {
    const { title, description, startDate, endDate, location } = event;
    return Event.create(
        {
            title,
            description,
            startDate,
            endDate,
            location,
            ...metadata
        }
    )
}

const fastReadEventById = async (id) => Event.exists(id);

const readEventById = async (id) => Event.findById(id);

const readEvents = async () => Event.find();

const readOngoingEvents = async (now = new Date()) => {
    return Event.find()
        .active()
        .upcomingFrom(now)
        .sort({ startDate: 1 });
};

const readPastEvents = async (now = new Date()) => {
    return Event.find().past(now);
};

const readUpcomingEvents = async (now = new Date()) => {
    return Event.find()
        .active()
        .upcomingFrom(now)
        .sort({ startDate: 1 });
};

const updateEvent = async (id, updates) => {
    return Event.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
        timestamps: true
    });
}

export const deleteEvent = async (eventId) => Event.findByIdAndDelete(eventId);

export default {
    createEvent,
    fastReadEventById,
    readEventById,
    readEvents,
    readOngoingEvents,
    readPastEvents,
    readUpcomingEvents,
    updateEvent,
    deleteEvent
}