import FeedingSchedule from "../models/feedingSchedule.model.js";

const createFeedingSchedule = async (dto) => FeedingSchedule.create(dto);

const fastReadFeedingScheduleById = async (id) => FeedingSchedule.exists(id);

const readFeedingScheduleById = async (id) => {
    return FeedingSchedule.findById(id)
        .lean();
}

const readFeedingSchedules = async (filter = {}) => {
    return FeedingSchedule.find(filter)
        .populate('animalId')
        .populate('staffId')
        .lean();
}

const updateFeedingSchedule = async (id, updates) => {
    return FeedingSchedule.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
        timestamps: true
    });
}

export const deleteFeedingSchedule = async (feedingScheduleId) => FeedingSchedule.findByIdAndDelete(feedingScheduleId);

export default {
    createFeedingSchedule,
    fastReadFeedingScheduleById,
    readFeedingScheduleById,
    readFeedingSchedules,
    updateFeedingSchedule,
    deleteFeedingSchedule
}