import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            index: true, // recherche rapide par réservation
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true, // recherche factures par utilisateur
        },

        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true
        },

        tickets: {
            count: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true, min: 0 },
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        tax: {
            type: Number,
            required: true,
            min: 0,
        },

        total: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: ["pending", "paid", "cancelled"],
            default: "pending",
            index: true, // recherche factures non payées
        },

        filePath: {
            type: String, // chemin du PDF/HTML généré
            required: true,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: false },
    }
);

// Recherche rapide par réservation
invoiceSchema.index({ booking_id: 1 });

// Recherche factures par utilisateur
invoiceSchema.index({ user_id: 1, created_at: -1 });

// Recherche factures par statut (ex: pour relance)
invoiceSchema.index({ status: 1 });

// Recherche par date de création (utile pour reporting)
invoiceSchema.index({ created_at: -1 });

export default mongoose.model("Invoice", invoiceSchema);
