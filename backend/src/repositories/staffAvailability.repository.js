import StaffAvailability from "../models/staffAvailability.model.js";

const createStaffAvailability = async (staffAvailability) => {
    const { staffId, startTime, endTime } = staffAvailability;
    return StaffAvailability.create(
        {
            staffId,
            startTime,
            endTime
        }
    )
}

const fastReadStaffAvailabilityById = async (staffAvailabilityId) => StaffAvailability.exists(staffAvailabilityId);

const readStaffAvailabilityById = async (staffAvailabilityId) => {
    return StaffAvailability.findById(staffAvailabilityId)
        .lean();
}

const readStaffAvailabilities = async (filter = {}) => {
    return StaffAvailability.find(filter)
        .populate('staffId')
        .lean();
}

const updateStaffAvailability = async (staffAvailabilityId, updates) => {
    return StaffAvailability.findByIdAndUpdate(staffAvailabilityId, updates, {
        new: true,
        runValidators: true,
        timestamps: true
    });
}

export const deleteStaffAvailability = async (staffAvailabilityId) => StaffAvailability.findByIdAndDelete(staffAvailabilityId);

export default {
    createStaffAvailability,
    fastReadStaffAvailabilityById,
    readStaffAvailabilityById,
    readStaffAvailabilities,
    updateStaffAvailability,
    deleteStaffAvailability
}