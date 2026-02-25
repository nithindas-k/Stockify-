import { IProductService } from './interfaces/IProductService';
import { IProductRepository } from '../repositories/interfaces/IProductRepository';
import { IProduct } from '../models/Product';
import { CreateProductDTO, UpdateProductDTO } from '../dtos/ProductDTO';

export class ProductService implements IProductService {
    private productRepository: IProductRepository;

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async createProduct(data: CreateProductDTO): Promise<IProduct> {
        const existing = await this.productRepository.findBySku(data.sku);
        if (existing) {
            throw new Error(`Product with SKU ${data.sku} already exists.`);
        }
        return await this.productRepository.create(data);
    }

    async getProductById(id: string): Promise<IProduct> {
        const product = await this.productRepository.findById(id);
        if (!product) throw new Error('Product not found');
        return product;
    }

    async getAllProducts(query?: string, category?: string): Promise<IProduct[]> {
        return await this.productRepository.findAll(query, category);
    }

    async updateProduct(id: string, data: UpdateProductDTO): Promise<IProduct> {
        if (data.sku) {
            const existing = await this.productRepository.findBySku(data.sku);
            if (existing && existing._id.toString() !== id) {
                throw new Error(`Product with SKU ${data.sku} already exists.`);
            }
        }
        const updated = await this.productRepository.update(id, data);
        if (!updated) throw new Error('Product not found');
        return updated;
    }

    async deleteProduct(id: string): Promise<void> {
        const deleted = await this.productRepository.delete(id);
        if (!deleted) throw new Error('Product not found');
    }

    async getLowStockProducts(): Promise<IProduct[]> {
        return await this.productRepository.findLowStock();
    }
}
