import staffTaskRepo from "../../repositories/staffTask.repository.js";

import MESSAGES from "../../constants/messages.js";

import { CustomError } from "../../middlewares/errorHandler.js";


export const createTask = async (params) => {
    return staffTaskRepo.createStaffTask(params);
};

export const updateTask = async (staffTaskId, updates) => {
    return staffTaskRepo.updateStaffTask(staffTaskId, updates);
};

export const deleteTask = async (staffTaskId) => {
    return staffTaskRepo.deleteStaffTask(staffTaskId);
};

export const findStaffTask = async (staffTaskId) => {
    const staffTask = await staffTaskRepo.readStaffTaskById(staffTaskId);

    if (!staffTask) throw new CustomError(MESSAGES.STAFF_TASK.NOT_FOUND);

    return staffTask
}