import mongoose from "mongoose";

const staffAvailabilitySchema = new mongoose.Schema(
    {
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        startTime: {
            type: Date,
            required: true
        },

        endTime: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

/**
 * Index pour optimiser les recherches de chevauchement
 * (très important pour les disponibilités)
 */
staffAvailabilitySchema.index({
    staffId: 1,
    startTime: 1,
    endTime: 1
});

/**
 * Validation basique au niveau schéma
 * (les règles complexes restent dans le service)
 */
staffAvailabilitySchema.pre("save", function (next) {
    if (this.endTime <= this.startTime) {
        const err = new Error("endTime must be after startTime");
        err.name = "ValidationError";
        return next(err);
    }
    next();
});

const StaffAvailability = mongoose.model("StaffAvailability", staffAvailabilitySchema, "staff_availabilities");

export default StaffAvailability;
