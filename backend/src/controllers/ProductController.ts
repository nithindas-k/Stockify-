import * as express from 'express';
import { IProductController } from './interfaces/IProductController';
import { IProductService } from '../services/interfaces/IProductService';
import { CreateProductSchema, UpdateProductSchema } from '../dtos/ProductDTO';
import { AuthRequest } from '../middleware/authMiddleware';
import { ProductMapper } from '../mappers/ProductMapper';
import { StatusCode } from '../enums/StatusCode';

export class ProductController implements IProductController {
    private _productService: IProductService;

    constructor(productService: IProductService) {
        this._productService = productService;
    }

    create = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const validatedData = CreateProductSchema.parse(req.body);
            const product = await this._productService.createProduct(userId, validatedData);
            res.status(StatusCode.CREATED).json(ProductMapper.toDTO(product));
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(StatusCode.BAD_REQUEST).json({ message: 'Validation failed', errors: error.errors });
                return;
            }
            res.status(StatusCode.BAD_REQUEST).json({ message: error.message || 'Error creating product' });
        }
    };

    getAll = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const { search, category } = req.query;
            const products = await this._productService.getAllProducts(
                userId,
                search as string | undefined,
                category as string | undefined
            );
            res.status(StatusCode.OK).json(products.map(ProductMapper.toDTO));
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message || 'Error fetching products' });
        }
    };

    getById = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const product = await this._productService.getProductById(userId, req.params.id as string);
            res.status(StatusCode.OK).json(ProductMapper.toDTO(product));
        } catch (error: any) {
            res.status(StatusCode.NOT_FOUND).json({ message: error.message || 'Product not found' });
        }
    };

    update = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const validatedData = UpdateProductSchema.parse(req.body);
            const product = await this._productService.updateProduct(userId, req.params.id as string, validatedData);
            res.status(StatusCode.OK).json(ProductMapper.toDTO(product));
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(StatusCode.BAD_REQUEST).json({ message: 'Validation failed', errors: error.errors });
                return;
            }
            res.status(StatusCode.BAD_REQUEST).json({ message: error.message || 'Error updating product' });
        }
    };

    delete = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            await this._productService.deleteProduct(userId, req.params.id as string);
            res.status(StatusCode.OK).json({ message: 'Product deleted successfully' });
        } catch (error: any) {
            res.status(StatusCode.NOT_FOUND).json({ message: error.message || 'Product not found' });
        }
    };

    getLowStock = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const products = await this._productService.getLowStockProducts(userId);
            res.status(StatusCode.OK).json(products.map(ProductMapper.toDTO));
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message || 'Error fetching low stock' });
        }
    };
}
