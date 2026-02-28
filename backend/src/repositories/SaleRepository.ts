import Sale, { ISale } from '../models/Sale';
import { ISaleRepository } from './interfaces/ISaleRepository';

export class SaleRepository implements ISaleRepository {
    async create(data: Partial<ISale>): Promise<ISale> {
        const sale = new Sale(data);
        return await sale.save();
    }

    async findById(userId: string, id: string): Promise<ISale | null> {
        return await Sale.findOne({ _id: id, userId }).populate('items.productId').populate('userId', 'name email');
    }

    async findAll(userId: string, query?: string): Promise<ISale[]> {
        let filter: any = { userId };
        if (query) {
            filter.$or = [
                { customerName: { $regex: query, $options: 'i' } }
            ];
        }
        return await Sale.find(filter).sort({ saleDate: -1 }).populate('items.productId').populate('userId', 'name email');
    }

    async findByCustomerId(userId: string, customerId: string): Promise<ISale[]> {
        return await Sale.find({ customerId, userId }).sort({ saleDate: -1 }).populate('items.productId').populate('userId', 'name email');
    }
}
