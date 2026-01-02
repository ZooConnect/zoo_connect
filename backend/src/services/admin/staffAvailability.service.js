import staffAvailabilityRepo from "../../repositories/staffAvailability.repository.js";

import MESSAGES from "../../constants/messages.js";

import { CustomError } from "../../middlewares/errorHandler.js";


export const createAvailability = async (params) => {
    return staffAvailabilityRepo.createStaffAvailability(params);
};

export const updateAvailability = async (staffAvailabilityId, updates) => {
    return staffAvailabilityRepo.updateStaffAvailability(staffAvailabilityId, updates);
};

export const deleteAvailability = async (staffAvailabilityId) => {
    return staffAvailabilityRepo.deleteStaffAvailability(staffAvailabilityId);
};

export const findStaffAvailability = async (staffAvailabilityId) => {
    const staffAvailability = await staffAvailabilityRepo.readStaffAvailabilityById(staffAvailabilityId);

    if (!staffAvailability) throw new CustomError(MESSAGES.STAFF_AVAILABILITY.NOT_FOUND);

    return staffAvailability
}