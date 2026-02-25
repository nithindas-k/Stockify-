import apiClient from '../../api/apiClient';
import { REPORT_ROUTES } from '../../utils/constants/apiRoutes';

/* ── Query types ────────────────────────────────────────────── */
export interface ReportParams {
    startDate?: string;
    endDate?: string;
}

/* ── Report Service ─────────────────────────────────────────── */
export const reportService = {
    getSummary: () =>
        apiClient.get(REPORT_ROUTES.SUMMARY),

    getSalesReport: (params?: ReportParams) =>
        apiClient.get(REPORT_ROUTES.SALES, { params }),

    getInventoryReport: (params?: ReportParams) =>
        apiClient.get(REPORT_ROUTES.INVENTORY, { params }),

    getCustomersReport: (params?: ReportParams) =>
        apiClient.get(REPORT_ROUTES.CUSTOMERS, { params }),

    getCustomerLedger: (customerId: string) =>
        apiClient.get(REPORT_ROUTES.CUSTOMER_LEDGER(customerId)),

    emailReport: (payload: { email: string; subject: string; htmlContent: string }) =>
        apiClient.post(REPORT_ROUTES.EMAIL_REPORT, payload),
};
