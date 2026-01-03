import * as feedingScheduleService from "../../services/admin/feedingSchedule.service.js";

import { respond } from "../../utils/response.helper.js";

import MESSAGES from "../../constants/messages.js";

const buildFeedingScheduleForCreation = (query) => {
    const feedingScheduleInput = {
        animalId: query.animalId,
        staffId: query.staffId,
        feedingTime: query.feedingTime,
        foodType: query.foodType
    };
    const metadata = {};
    const propsToVerify = ["frequency", "notes"];

    for (const key of propsToVerify) {
        if (query[key]) metadata[key] = query[key];
    }
    return { feedingScheduleInput, metadata };
};

const buildFeedingScheduleFilter = (query) => {
    const filter = {};
    const propsToVerify = ["feedingTime", "foodType", "frequency", "notes"];

    for (const key of propsToVerify) {
        if (query[key]) filter[key] = query[key];
    }
    return filter;
};



export const getFeedingSchedules = async (req, res, next) => {
    try {
        const schedules = await feedingScheduleService.getFeedingSchedules();
        respond(res, MESSAGES.FEEDING_SCHEDULE.FEEDING_SCHEDULES_FOUND, schedules);
    } catch (error) {
        next(error);
    }
};

export const createFeedingSchedule = async (req, res, next) => {
    try {
        const { feedingScheduleInput, metadata } = buildFeedingScheduleForCreation(req.body);
        const feedingSchedule = await feedingScheduleService.createFeedingSchedule(feedingScheduleInput, metadata);
        respond(res, MESSAGES.FEEDING_SCHEDULE.CREATED_SUCCESS, feedingSchedule);
    } catch (error) {
        next(error);
    }
};

export const updateFeedingSchedule = async (req, res, next) => {
    try {
        const feedingScheduleId = req.params.feedingScheduleId || req.params.id;
        const updates = req.body;
        const updatedFeedingSchedule = await feedingScheduleService.updateFeedingSchedule(feedingScheduleId, updates);
        return respond(res, MESSAGES.FEEDING_SCHEDULE.UPDATED, updatedFeedingSchedule);
    } catch (error) {
        next(error);
    }
};