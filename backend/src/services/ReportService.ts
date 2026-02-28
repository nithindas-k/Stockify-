import { ISaleRepository } from '../repositories/interfaces/ISaleRepository';
import { IProductRepository } from '../repositories/interfaces/IProductRepository';
import { ICustomerRepository } from '../repositories/interfaces/ICustomerRepository';
import { IReportService } from './interfaces/IReportService';

export class ReportService implements IReportService {
    constructor(
        private saleRepo: ISaleRepository,
        private productRepo: IProductRepository,
        private customerRepo: ICustomerRepository
    ) { }

    async getSalesReport(userId: string, startDate?: string, endDate?: string): Promise<any> {
        // We'll use the repositories to get the data
        const sales = await this.saleRepo.findAll(userId, '', startDate, endDate);

        const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);

        return {
            summary: {
                totalRevenue,
                totalSales: sales.length
            },
            sales
        };
    }

    async getItemsReport(userId: string): Promise<any> {
        const products = await this.productRepo.findAll(userId);

        let totalInventoryValue = 0;
        let lowStockCount = 0;

        products.forEach(p => {
            totalInventoryValue += (p.price * p.quantity);
            if (p.quantity <= p.lowStockThreshold) {
                lowStockCount++;
            }
        });

        return {
            summary: {
                totalValue: totalInventoryValue,
                totalItems: products.length,
                lowStockItems: lowStockCount
            },
            items: products
        };
    }

    async getCustomerLedger(userId: string, customerId: string): Promise<any> {
        const customer = await this.customerRepo.findById(userId, customerId);
        if (!customer) throw new Error('Customer not found');

        const transactions = await this.saleRepo.findByCustomerId(userId, customerId);

        const totalSpent = transactions.reduce((acc, sale) => acc + sale.totalAmount, 0);

        return {
            customer,
            summary: {
                totalSpent,
                totalPurchases: transactions.length
            },
            transactions
        };
    }
}
