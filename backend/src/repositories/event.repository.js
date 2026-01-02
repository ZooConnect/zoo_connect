import Event from "../models/event.model.js";

const createEvent = async (event, data = {}) => {
    const { title, description, start_date, end_date, location } = event;
    return Event.create(
        {
            title,
            description,
            start_date,
            end_date,
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
        .sort({ start_date: 1 });
};

const readPastEvents = async (now = new Date()) => {
    return Event.find().past(now);
};

const readUpcomingEvents = async (now = new Date()) => {
    return Event.find()
        .active()
        .upcomingFrom(now)
        .sort({ start_date: 1 });
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