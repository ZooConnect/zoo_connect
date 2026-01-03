import invoiceRepo from "../../repositories/invoice.repository.js";

import MESSAGES from "../../constants/messages.js";

import { CustomError } from "../../middlewares/errorHandler.js";


export const createInvoice = async (params) => {
    return invoiceRepo.createInvoice(params);
};

export const updateInvoice = async (invoiceId, updates) => {
    return invoiceRepo.updateInvoice(invoiceId, updates);
};

export const deleteInvoice = async (invoiceId) => {
    return invoiceRepo.deleteInvoice(invoiceId);
};

export const findInvoice = async (invoiceId) => {
    const invoice = await invoiceRepo.readInvoiceById(invoiceId);

    if (!invoice) throw new CustomError(MESSAGES.STAFF_TASK.NOT_FOUND);

    return invoice
}