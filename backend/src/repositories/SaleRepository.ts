import Sale, { ISale } from '../models/Sale';
import { ISaleRepository } from './interfaces/ISaleRepository';

export class SaleRepository implements ISaleRepository {
    async create(data: Partial<ISale>): Promise<ISale> {
        const sale = new Sale(data);
        return await sale.save();
    }

    async findById(id: string): Promise<ISale | null> {
        return await Sale.findById(id).populate('items.productId');
    }

    async findAll(query?: string): Promise<ISale[]> {
        let filter: any = {};
        if (query) {
            filter.$or = [
                { customerName: { $regex: query, $options: 'i' } }
            ];
        }
        return await Sale.find(filter).sort({ saleDate: -1 }).populate('items.productId');
    }

    async findByCustomerId(customerId: string): Promise<ISale[]> {
        return await Sale.find({ customerId }).sort({ saleDate: -1 }).populate('items.productId');
    }
}
