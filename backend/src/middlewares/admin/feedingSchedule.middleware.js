import * as feedingScheduleService from "../../services/admin/feedingSchedule.service.js";

export const requireAdminOrStaff = (req, res, next) => {
    const user = req.user;
    feedingScheduleService.requireAdminOrStaff(user);
    next();
};

export const canGetFeedingSchedules = [
    requireAdminOrStaff
];

export const canCreateFeedingSchedule = [
    requireAdminOrStaff
];

export const canUpdateFeedingSchedule = [
    requireAdminOrStaff
];