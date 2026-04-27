import { IProductRepository } from '../repositories/interfaces/IProductRepository';
import { ISaleRepository } from '../repositories/interfaces/ISaleRepository';
import { ICustomerRepository } from '../repositories/interfaces/ICustomerRepository';
import { IDashboardService } from './interfaces/IDashboardService';

export class DashboardService implements IDashboardService {
    constructor(
        private _productRepo: IProductRepository,
        private _saleRepo: ISaleRepository,
        private _customerRepo: ICustomerRepository
    ) { }

    async getStats(userId: string) {
        const [products, sales, customers, lowStockItems] = await Promise.all([
            this._productRepo.findAll(userId),
            this._saleRepo.findAll(userId),
            this._customerRepo.findAll(userId),
            this._productRepo.findLowStock(userId)
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
