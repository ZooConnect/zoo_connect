import mongoose from 'mongoose';

const feedingScheduleSchema = new mongoose.Schema({
    animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    feedingTime: { type: String, required: true }, // Format "HH:mm"
    foodType: { type: String, required: true },
    frequency: { type: String, default: "Quotidien" },
    notes: { type: String },
}, { timestamps: true });


const FeedingSchedule = mongoose.model('FeedingSchedule', feedingScheduleSchema);
export default FeedingSchedule;