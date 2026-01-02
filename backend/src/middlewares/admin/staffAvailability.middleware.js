import * as staffAvailabilityService from "../../services/admin/staffAvailability.service.js";


export const findStaffAvailability = async (req, res, next) => {
    try {
        const staffAvailabilityId = req.params.id;
        const staffAvailability = await staffAvailabilityService.findStaffAvailability(staffAvailabilityId);
        req.staffAvailability = staffAvailability;
        next();
    } catch (error) {
        return next(error);
    }
};