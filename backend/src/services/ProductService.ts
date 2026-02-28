import { IProductService } from './interfaces/IProductService';
import { IProductRepository } from '../repositories/interfaces/IProductRepository';
import { IProduct } from '../models/Product';
import { CreateProductDTO, UpdateProductDTO } from '../dtos/ProductDTO';

export class ProductService implements IProductService {
    private productRepository: IProductRepository;

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async createProduct(userId: string, data: CreateProductDTO): Promise<IProduct> {
        const existing = await this.productRepository.findBySku(userId, data.sku);
        if (existing) {
            throw new Error(`Product with SKU ${data.sku} already exists.`);
        }
        return await this.productRepository.create(userId, data);
    }

    async getProductById(userId: string, id: string): Promise<IProduct> {
        const product = await this.productRepository.findById(userId, id);
        if (!product) throw new Error('Product not found');
        return product;
    }

    async getAllProducts(userId: string, query?: string, category?: string): Promise<IProduct[]> {
        return await this.productRepository.findAll(userId, query, category);
    }

    async updateProduct(userId: string, id: string, data: UpdateProductDTO): Promise<IProduct> {
        if (data.sku) {
            const existing = await this.productRepository.findBySku(userId, data.sku);
            if (existing && existing._id.toString() !== id) {
                throw new Error(`Product with SKU ${data.sku} already exists.`);
            }
        }
        const updated = await this.productRepository.update(userId, id, data);
        if (!updated) throw new Error('Product not found');
        return updated;
    }

    async deleteProduct(userId: string, id: string): Promise<void> {
        const deleted = await this.productRepository.delete(userId, id);
        if (!deleted) throw new Error('Product not found');
    }

    async getLowStockProducts(userId: string): Promise<IProduct[]> {
        return await this.productRepository.findLowStock(userId);
    }
}
