import { IProductService } from './interfaces/IProductService';
import { IProductRepository } from '../repositories/interfaces/IProductRepository';
import { IProduct } from '../models/Product';
import { CreateProductDTO, UpdateProductDTO } from '../dtos/ProductDTO';
import { INotificationService } from './interfaces/INotificationService';

export class ProductService implements IProductService {
    private _productRepository: IProductRepository;
    private _notificationService: INotificationService | undefined;

    constructor(productRepository: IProductRepository, notificationService?: INotificationService) {
        this._productRepository = productRepository;
        this._notificationService = notificationService;
    }

    async createProduct(userId: string, data: CreateProductDTO): Promise<IProduct> {
        if (data.name) data.name = data.name.trim();
        if (data.sku) data.sku = data.sku.trim();
        const existingSku = await this._productRepository.findBySku(userId, data.sku);
        if (existingSku) {
            throw new Error(`Product with SKU ${data.sku} already exists.`);
        }

        const existingName = await this._productRepository.findByName(userId, data.name);
        if (existingName) {
            throw new Error(`Product with name "${data.name}" already exists.`);
        }
        const product = await this._productRepository.create(userId, data);


        if (this._notificationService && product.quantity < 5) {
            await this._notificationService.createLowStockNotification(
                userId,
                product._id.toString(),
                product.name,
                product.quantity
            );
        }

        return product;
    }

    async getProductById(userId: string, id: string): Promise<IProduct> {
        const product = await this._productRepository.findById(userId, id);
        if (!product) throw new Error('Product not found');
        return product;
    }

    async getAllProducts(userId: string, query?: string, category?: string): Promise<IProduct[]> {
        return await this._productRepository.findAll(userId, query, category);
    }

    async updateProduct(userId: string, id: string, data: UpdateProductDTO): Promise<IProduct> {
        if (data.name) data.name = data.name.trim();
        if (data.sku) data.sku = data.sku.trim();
        if (data.sku) {
            const existing = await this._productRepository.findBySku(userId, data.sku);
            if (existing && existing._id.toString() !== id) {
                throw new Error(`Product with SKU ${data.sku} already exists.`);
            }
        }
        if (data.name) {
            const existing = await this._productRepository.findByName(userId, data.name);
            if (existing && existing._id.toString() !== id) {
                throw new Error(`Product with name "${data.name}" already exists.`);
            }
        }
        const updated = await this._productRepository.update(userId, id, data);
        if (!updated) throw new Error('Product not found');


        if (this._notificationService && updated.quantity < 5) {
            await this._notificationService.createLowStockNotification(
                userId,
                updated._id.toString(),
                updated.name,
                updated.quantity
            );
        }

        return updated;
    }

    async deleteProduct(userId: string, id: string): Promise<void> {
        const deleted = await this._productRepository.delete(userId, id);
        if (!deleted) throw new Error('Product not found');
    }

    async getLowStockProducts(userId: string): Promise<IProduct[]> {
        return await this._productRepository.findLowStock(userId);
    }
}
