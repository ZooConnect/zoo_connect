import * as staffAvailabilityService from "../../services/admin/staffAvailability.service.js";

import { respond } from "../../utils/response.helper.js";

import MESSAGES from "../../constants/messages.js";

export const createAvailability = async (req, res, next) => {
    try {
        const { startTime, endTime } = req.body;
        const staffAvailability = await staffAvailabilityService.createAvailability({ staffId: req.user._id, startTime, endTime });
        respond(res, MESSAGES.STAFF_AVAILABILITY.CREATED_SUCCESS, staffAvailability);
    } catch (error) {
        next(error);
    }
};

export const updateAvailability = async (req, res, next) => {
    try {
        const { startTime, endTime } = req.body;
        const updatedAvailability = await staffAvailabilityService.updateAvailability(req.staffAvailability._id, { staffId: req.user._id, startTime, endTime });
        respond(res, MESSAGES.STAFF_AVAILABILITY.UPDATED_SUCCES, updatedAvailability);
    } catch (error) {
        next(error);
    }
};

export const deleteAvailability = async (req, res, next) => {
    try {
        await staffAvailabilityService.deleteAvailability(req.staffAvailability._id);
        respond(res, MESSAGES.STAFF_AVAILABILITY.DELETED_SUCCES);
    } catch (error) {
        next(error);
    }
};