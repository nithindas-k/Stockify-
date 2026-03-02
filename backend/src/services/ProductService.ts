import { IProductService } from './interfaces/IProductService';
import { IProductRepository } from '../repositories/interfaces/IProductRepository';
import { IProduct } from '../models/Product';
import { CreateProductDTO, UpdateProductDTO } from '../dtos/ProductDTO';
import { INotificationService } from './interfaces/INotificationService';

export class ProductService implements IProductService {
    private productRepository: IProductRepository;
    private notificationService: INotificationService | undefined;

    constructor(productRepository: IProductRepository, notificationService?: INotificationService) {
        this.productRepository = productRepository;
        this.notificationService = notificationService;
    }

    async createProduct(userId: string, data: CreateProductDTO): Promise<IProduct> {
        const existing = await this.productRepository.findBySku(userId, data.sku);
        if (existing) {
            throw new Error(`Product with SKU ${data.sku} already exists.`);
        }
        const product = await this.productRepository.create(userId, data);


        if (this.notificationService && product.quantity < 5) {
            await this.notificationService.createLowStockNotification(
                userId,
                product._id.toString(),
                product.name,
                product.quantity
            );
        }

        return product;
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

    
        if (this.notificationService && updated.quantity < 5) {
            await this.notificationService.createLowStockNotification(
                userId,
                updated._id.toString(),
                updated.name,
                updated.quantity
            );
        }

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
