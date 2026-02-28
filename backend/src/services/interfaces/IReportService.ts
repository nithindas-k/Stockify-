export interface IReportService {
    getSalesReport(userId: string, startDate?: string, endDate?: string): Promise<any>;
    getItemsReport(userId: string): Promise<any>;
    getCustomerLedger(userId: string, customerId: string): Promise<any>;
}
