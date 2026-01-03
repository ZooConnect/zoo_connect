import mongoose from "mongoose";

const staffTaskSchema = new mongoose.Schema(
    {
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        taskType: {
            type: String,
            required: true,
            enum: ["task", "event", "care", "feeding", "cleaning", "other"],
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        startTime: {
            type: Date,
            required: true,
        },

        endTime: {
            type: Date,
            required: true,
        },

        relatedEntity: {
            kind: {
                type: String,
                required: true,
                enum: ["Animal", "Event", "FeedingSchedule"], // ⚠️ nom des modèles
            },
            item: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                refPath: "relatedEntity.kind",
            },
        },

        status: {
            type: String,
            enum: ["pending", "in_progress", "completed", "cancelled"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

// Index principal : utilisateur + date (le plus utilisé)
staffTaskSchema.index({ staffId: 1, startTime: 1 });

// Pour filtrer par type de tâche
staffTaskSchema.index({ staffId: 1, taskType: 1 });

// Pour filtrer par statut (ex : tâches en cours)
staffTaskSchema.index({ staffId: 1, status: 1 });

// Pour les vues calendrier (plage de dates)
staffTaskSchema.index({ staffId: 1, startTime: 1, endTime: 1 });

// Pour les entités liées (animal / activité)
staffTaskSchema.index({
    staffId: 1,
    "relatedEntity.type": 1,
    "relatedEntity.ref_id": 1,
});


const StaffTask = mongoose.model("StaffTask", staffTaskSchema);
export default StaffTask;
