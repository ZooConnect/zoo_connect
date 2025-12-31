import FeedingSchedule from '../models/feedingSchedule.model.js';

export const getFeedingSchedules = async (req, res) => {
    try {
        const schedules = await FeedingSchedule.find()
            .populate('animal_id', 'name species')
            .populate('staff_id', 'name');
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createFeedingSchedule = async (req, res) => {
    if (req.user.role !== 'staff' && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const newSchedule = new FeedingSchedule(req.body);
        await newSchedule.save();
        res.status(201).json(newSchedule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateFeedingSchedule = async (req, res) => {
    try {
        const updated = await FeedingSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};