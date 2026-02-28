import * as express from 'express';
import { IProductController } from './interfaces/IProductController';
import { IProductService } from '../services/interfaces/IProductService';
import { CreateProductSchema, UpdateProductSchema } from '../dtos/ProductDTO';

export class ProductController implements IProductController {
    private productService: IProductService;

    constructor(productService: IProductService) {
        this.productService = productService;
    }

    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = (req as any).user.id;
            const validatedData = CreateProductSchema.parse(req.body);
            const product = await this.productService.createProduct(userId, validatedData);
            res.status(201).json(product);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({ message: 'Validation failed', errors: error.errors });
                return;
            }
            res.status(400).json({ message: error.message || 'Error creating product' });
        }
    }

    async getAll(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = (req as any).user.id;
            const { search, category } = req.query;
            const products = await this.productService.getAllProducts(
                userId,
                search as string | undefined,
                category as string | undefined
            );
            res.status(200).json(products);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error fetching products' });
        }
    }

    async getById(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = (req as any).user.id;
            const product = await this.productService.getProductById(userId, req.params.id as string);
            res.status(200).json(product);
        } catch (error: any) {
            res.status(404).json({ message: error.message || 'Product not found' });
        }
    }

    async update(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = (req as any).user.id;
            const validatedData = UpdateProductSchema.parse(req.body);
            const product = await this.productService.updateProduct(userId, req.params.id as string, validatedData);
            res.status(200).json(product);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({ message: 'Validation failed', errors: error.errors });
                return;
            }
            res.status(400).json({ message: error.message || 'Error updating product' });
        }
    }

    async delete(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = (req as any).user.id;
            await this.productService.deleteProduct(userId, req.params.id as string);
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error: any) {
            res.status(404).json({ message: error.message || 'Product not found' });
        }
    }

    async getLowStock(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = (req as any).user.id;
            const products = await this.productService.getLowStockProducts(userId);
            res.status(200).json(products);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error fetching low stock' });
        }
    }
}
