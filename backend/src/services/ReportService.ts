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

    async getSalesReport(startDate?: string, endDate?: string): Promise<any> {
        // We'll use the repositories to get the data
        const sales = await this.saleRepo.findAll('', startDate, endDate);

        const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);

        return {
            summary: {
                totalRevenue,
                totalSales: sales.length
            },
            sales
        };
    }

    async getItemsReport(): Promise<any> {
        const products = await this.productRepo.findAll('');

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

    async getCustomerLedger(customerId: string): Promise<any> {
        const customer = await this.customerRepo.findById('', customerId);
        if (!customer) throw new Error('Customer not found');

        const transactions = await this.saleRepo.findByCustomerId('', customerId);

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
