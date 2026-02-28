import { IProductRepository } from '../repositories/interfaces/IProductRepository';
import { ISaleRepository } from '../repositories/interfaces/ISaleRepository';
import { ICustomerRepository } from '../repositories/interfaces/ICustomerRepository';
import { IDashboardService } from './interfaces/IDashboardService';

export class DashboardService implements IDashboardService {
    constructor(
        private productRepo: IProductRepository,
        private saleRepo: ISaleRepository,
        private customerRepo: ICustomerRepository
    ) { }

    async getStats(userId: string) {
        const [products, sales, customers, lowStockItems] = await Promise.all([
            this.productRepo.findAll(userId),
            this.saleRepo.findAll(userId),
            this.customerRepo.findAll(userId),
            this.productRepo.findLowStock(userId)
        ]);

        const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);

        return {
            totalProducts: products.length,
            totalRevenue,
            totalCustomers: customers.length,
            lowStockCount: lowStockItems.length,
            recentSales: sales.slice(0, 5).map(sale => ({
                id: sale._id,
                customer: sale.customerName,
                amount: sale.totalAmount,
                date: sale.saleDate,
                items: sale.items.length
            }))
        };
    }
}
