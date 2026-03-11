import { z } from 'zod';

export const CreateProductSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    sku: z.string().min(2, 'SKU must be at least 2 characters'),
    category: z.string().min(2, 'Category is required'),
    quantity: z.number().gt(0, 'Quantity must be greater than 0'),
    price: z.number().gt(0, 'Price must be greater than 0'),
    lowStockThreshold: z.number().min(0).optional(),
    description: z.string().optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;
