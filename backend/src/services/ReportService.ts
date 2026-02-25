import Sale from '../models/Sale';
import Product from '../models/Product';
import Customer from '../models/Customer';
import mongoose from 'mongoose';

export class ReportService {

  
    async getSalesReport(startDate?: string, endDate?: string): Promise<any> {
        let matchStage: any = {};

        if (startDate || endDate) {
            matchStage.saleDate = {};
            if (startDate) matchStage.saleDate.$gte = new Date(startDate);
            if (endDate) matchStage.saleDate.$lte = new Date(endDate);
        }

        const sales = await Sale.find(matchStage).sort({ saleDate: -1 }).populate('items.productId');

        
        const aggregation = await Sale.aggregate([
            { $match: matchStage },
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" }, totalSales: { $sum: 1 } } }
        ]);

        const summary = aggregation.length > 0 ? aggregation[0] : { totalRevenue: 0, totalSales: 0 };

        return {
            summary,
            sales
        };
    }

    
    async getItemsReport(): Promise<any> {
        const products = await Product.find().sort({ quantity: 1 });

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
        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            throw new Error('Invalid customer ID');
        }

        const customer = await Customer.findById(customerId);
        if (!customer) {
            throw new Error('Customer not found');
        }

        const transactions = await Sale.find({ customerId: customer._id })
            .sort({ saleDate: -1 })
            .populate('items.productId');

        const aggregation = await Sale.aggregate([
            { $match: { customerId: customer._id } },
            { $group: { _id: null, totalSpent: { $sum: "$totalAmount" }, totalPurchases: { $sum: 1 } } }
        ]);

        const summary = aggregation.length > 0 ? aggregation[0] : { totalSpent: 0, totalPurchases: 0 };

        return {
            customer,
            summary,
            transactions
        };
    }
}
