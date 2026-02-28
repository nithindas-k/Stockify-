import { IProductRepository } from './interfaces/IProductRepository';
import Product, { IProduct } from '../models/Product';
import { CreateProductDTO, UpdateProductDTO } from '../dtos/ProductDTO';

export class ProductRepository implements IProductRepository {
    async create(userId: string, data: CreateProductDTO): Promise<IProduct> {
        const product = new Product({ ...data, userId });
        return await product.save();
    }

    async findById(userId: string, id: string): Promise<IProduct | null> {
        return await Product.findOne({ _id: id, userId });
    }

    async findBySku(userId: string, sku: string): Promise<IProduct | null> {
        return await Product.findOne({ sku, userId });
    }

    async findAll(userId: string, query?: string, category?: string): Promise<IProduct[]> {
        const filter: any = { userId };
        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { sku: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }
        if (category) {
            filter.category = category;
        }
        return await Product.find(filter).sort({ createdAt: -1 });
    }

    async update(userId: string, id: string, data: UpdateProductDTO): Promise<IProduct | null> {
        return await Product.findOneAndUpdate({ _id: id, userId }, data, { new: true });
    }

    async delete(userId: string, id: string): Promise<boolean> {
        const result = await Product.findOneAndDelete({ _id: id, userId });
        return !!result;
    }

    async findLowStock(userId: string): Promise<IProduct[]> {
        return await Product.find({ userId, $expr: { $lte: ['$quantity', '$lowStockThreshold'] } }).sort({ quantity: 1 });
    }
}
