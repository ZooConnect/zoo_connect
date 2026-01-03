import feedingScheduleRepo from "../../repositories/feedingSchedule.repository.js";

import MESSAGES from "../../constants/messages.js";

import { CustomError } from "../../middlewares/errorHandler.js";


export const getFeedingSchedules = async () => {
    return feedingScheduleRepo.readFeedingSchedules();
};

export const createFeedingSchedule = async (feedingScheduleInput, metadata = {}) => {
    return feedingScheduleRepo.createFeedingSchedule({ ...feedingScheduleInput, ...metadata });
};

export const updateFeedingSchedule = async (feedingScheduleId, updates) => {
    return feedingScheduleRepo.updateFeedingSchedule(feedingScheduleId, updates);
};