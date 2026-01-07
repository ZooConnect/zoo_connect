import invoiceRepo from "../../repositories/invoice.repository.js";
import userRepo from "../../repositories/user.repository.js";
import * as eventService from "../../services/event.service.js";

import MESSAGES from "../../constants/messages.js";

import { CustomError } from "../../middlewares/errorHandler.js";
import { sendEmail } from "../../helpers/email.helper.js";


export const createInvoice = async (params) => {
    // Build required invoice fields when missing
    const bookingId = params.bookingId || params.booking_id || null;
    const userId = params.userId || params.user_id || params.user || null;
    const eventId = params.eventId || params.event_id || params.event || null;

    // tickets: count & price
    let count = params.tickets?.count || params.quantity || 1;
    let price = params.tickets?.price || 0;

    // try to infer price from event if not provided
    if ((!price || price === 0) && eventId) {
        try {
            const event = await eventService.findEventById(eventId);
            if (event && typeof event.price === 'number') price = event.price;
        } catch (e) {
            // ignore
        }
    }

    const amount = params.amount || (price * count) || 0;
    const tax = params.tax || 0;
    const total = params.total || (amount + tax);

    const filePath = params.filePath || params.file_path || `/invoices/${bookingId || Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;

    const invoicePayload = {
        bookingId,
        userId,
        eventId,
        tickets: {
            count,
            price
        },
        amount,
        tax,
        total,
        status: params.status || 'pending',
        filePath
    };

    const invoice = await invoiceRepo.createInvoice(invoicePayload);

    // send confirmation email to user only when invoice is paid
    try {
        if (invoice && invoice.status === 'paid') {
            const user = params.userId ? await userRepo.readUserById(params.userId) : null;
            const to = user && user.email ? user.email : null;
            if (to) {
                await sendEmail({
                    to,
                    subject: 'Payment confirmed / Invoice paid',
                    text: `Your payment has been confirmed. Amount: ${invoice.total || invoice.amount || 0}. Thank you!`
                });
            } else {
                console.log('Invoice paid but user email not found.');
            }
        } else {
            console.log('Invoice created with status', invoice && invoice.status, '- email will be sent when status becomes paid.');
        }
    } catch (err) {
        console.error('Failed to send invoice email:', err);
    }

    return invoice;
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