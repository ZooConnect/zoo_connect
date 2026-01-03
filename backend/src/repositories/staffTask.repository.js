import StaffTask from "../models/staffTask.model.js";

const createStaffTask = async (staffTask) => StaffTask.create({ staffTask });

const fastReadStaffTaskById = async (staffTaskId) => StaffTask.exists(staffTaskId);

const readStaffTaskById = async (staffTaskId) => {
    return StaffTask.findById(staffTaskId)
        .populate('staffId')
        .populate("relatedEntity.item")
        .lean();
}

const readStaffTasks = async (filter = {}) => {
    return StaffTask.find(filter)
        .populate('staffId')
        .populate("relatedEntity.item")
        .lean();
}

const updateStaffTask = async (staffTaskId, updates) => {
    return StaffTask.findByIdAndUpdate(staffTaskId, updates, {
        new: true,
        runValidators: true,
        timestamps: true
    });
}

export const deleteStaffTask = async (staffTaskId) => StaffTask.findByIdAndDelete(staffTaskId);

export default {
    createStaffTask,
    fastReadStaffTaskById,
    readStaffTaskById,
    readStaffTasks,
    updateStaffTask,
    deleteStaffTask
}