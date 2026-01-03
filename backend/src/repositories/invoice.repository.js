import Invoice from "../models/invoice.model.js";

const createInvoice = async (dto) => Invoice.create(dto);

const fastReadInvoiceById = async (invoiceId) => Invoice.exists(invoiceId);

const readInvoiceById = async (invoiceId) => {
    return Invoice.findById(invoiceId)
        .populate('bookingId')
        .populate("userId")
        .lean();
}

const readInvoices = async (filter = {}) => {
    return Invoice.find(filter)
        .populate('bookingId')
        .populate("userId")
        .lean();
}

const updateInvoice = async (invoiceId, updates) => {
    return Invoice.findByIdAndUpdate(invoiceId, updates, {
        new: true,
        runValidators: true,
        timestamps: true
    });
}

export const deleteInvoice = async (invoiceId) => Invoice.findByIdAndDelete(invoiceId);

export default {
    createInvoice,
    fastReadInvoiceById,
    readInvoiceById,
    readInvoices,
    updateInvoice,
    deleteInvoice
}