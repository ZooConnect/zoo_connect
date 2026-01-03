import * as staffTaskService from "../../services/admin/staffTask.service.js";


export const findStaffTask = async (req, res, next) => {
    try {
        const staffTaskId = req.params.id;
        const staffTask = await staffTaskService.findStaffTask(staffTaskId);
        req.staffTask = staffTask;
        next();
    } catch (error) {
        return next(error);
    }
};