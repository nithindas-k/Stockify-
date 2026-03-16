import { IProduct } from '../models/Product';
import { ProductResponseDTO } from '../dtos/ProductDTO';

export class ProductMapper {
    static toDTO(product: IProduct): ProductResponseDTO {
        return {
            id: product._id.toString(),
            name: product.name,
            sku: product.sku,
            category: product.category,
            quantity: product.quantity,
            price: product.price,
            lowStockThreshold: product.lowStockThreshold,
            description: product.description || '',
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
        };
    }
}
