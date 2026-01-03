import * as staffTaskService from "../../services/admin/staffTask.service.js";

import { respond } from "../../utils/response.helper.js";

import MESSAGES from "../../constants/messages.js";

export const createTask = async (req, res, next) => {
    try {
        const {
            taskType,
            description,
            startTime,
            endTime,
            relatedEntity = {},
            status = "pending"
        } = req.body;

        const staffTask = await staffTaskService.createTask({
            staffId: req.user._id,
            taskType, description,
            startTime,
            endTime,
            relatedEntity,
            status
        });
        respond(res, MESSAGES.STAFF_TASK.CREATED_SUCCESS, staffTask);
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const { startTime, endTime } = req.body;
        const updatedTask = await staffTaskService.updateTask(req.staffTask._id, { staffId: req.user._id, startTime, endTime });
        respond(res, MESSAGES.STAFF_TASK.UPDATED_SUCCES, updatedTask);
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        await staffTaskService.deleteTask(req.staffTask._id);
        respond(res, MESSAGES.STAFF_TASK.DELETED_SUCCES);
    } catch (error) {
        next(error);
    }
};