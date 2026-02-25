import { IProductRepository } from './interfaces/IProductRepository';
import Product, { IProduct } from '../models/Product';
import { CreateProductDTO, UpdateProductDTO } from '../dtos/ProductDTO';

export class ProductRepository implements IProductRepository {
    async create(data: CreateProductDTO): Promise<IProduct> {
        const product = new Product(data);
        return await product.save();
    }

    async findById(id: string): Promise<IProduct | null> {
        return await Product.findById(id);
    }

    async findBySku(sku: string): Promise<IProduct | null> {
        return await Product.findOne({ sku });
    }

    async findAll(query?: string, category?: string): Promise<IProduct[]> {
        const filter: any = {};
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

    async update(id: string, data: UpdateProductDTO): Promise<IProduct | null> {
        return await Product.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await Product.findByIdAndDelete(id);
        return !!result;
    }

    async findLowStock(): Promise<IProduct[]> {
        return await Product.find({ $expr: { $lte: ['$quantity', '$lowStockThreshold'] } }).sort({ quantity: 1 });
    }
}
