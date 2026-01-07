import bookingRepo from "../../repositories/booking.repository.js";
import invoiceRepo from "../../repositories/invoice.repository.js";
import staffTaskRepo from "../../repositories/staffTask.repository.js";

/**
 * Build a Mongo filter for a date range on a given field
 */
const buildDateFilter = (field, start, end) => {
    const filter = {};
    if (start || end) filter[field] = {};
    if (start) filter[field]["$gte"] = new Date(start);
    if (end) filter[field]["$lte"] = new Date(end);
    return filter;
};

export const getReports = async ({ start, end, type = 'all' } = {}) => {
    const result = {};

    // Visitors: count tickets from bookings (quantity) with status active
    if (type === 'all' || type === 'visitors') {
        const bookingFilter = { status: 'active', ...buildDateFilter('bookingDate', start, end) };
        const bookings = await bookingRepo.readBookings();
        // filter in JS to avoid changing repository APIs
        const filtered = bookings.filter(b => {
            const d = new Date(b.bookingDate);
            if (start && d < new Date(start)) return false;
            if (end && d > new Date(end)) return false;
            return b.status === 'active';
        });
        const tickets = filtered.reduce((s, b) => s + (b.quantity || 0), 0);
        result.visitors = {
            totalBookings: filtered.length,
            totalVisitors: tickets
        };
    }

    // Revenue: sum invoice.total where status == 'paid'
    if (type === 'all' || type === 'revenue') {
        const invoices = await invoiceRepo.readInvoices();
        const filtered = invoices.filter(inv => {
            const d = new Date(inv.created_at || inv.createdAt || inv.createdAt);
            if (start && d < new Date(start)) return false;
            if (end && d > new Date(end)) return false;
            return inv.status === 'paid';
        });
        const total = filtered.reduce((s, inv) => s + (inv.total || inv.amount || 0), 0);
        result.revenue = {
            totalRevenue: total,
            invoicesCount: filtered.length
        };
    }

    // Health: use staff tasks with taskType 'care' as health checks
    if (type === 'all' || type === 'health') {
        const tasks = await staffTaskRepo.readStaffTasks();
        const filtered = tasks.filter(t => {
            const d = new Date(t.startTime);
            if (start && d < new Date(start)) return false;
            if (end && d > new Date(end)) return false;
            return t.taskType === 'care';
        });

        const treatments = filtered.filter(t => /treat|treatment|inject|medic/i.test(t.description || ''));
        const alerts = filtered.filter(t => /alert|urgent|vet|veterin/i.test(t.description || ''));

        result.health = {
            checks: filtered.length,
            treatments: treatments.length,
            alerts: alerts.length
        };
    }

    return result;
};
