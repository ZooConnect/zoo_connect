import * as reportsService from "../../services/admin/reports.service.js";
import { respond } from "../../helpers/response.helper.js";
import MESSAGES from "../../constants/messages.js";

export const getReports = async (req, res, next) => {
    try {
        const { start, end, type } = req.query;
        const reports = await reportsService.getReports({ start, end, type });
        respond(res, MESSAGES.REPORTS.GENERATED, reports);
    } catch (err) {
        next(err);
    }
};
