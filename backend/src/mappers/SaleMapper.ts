import { ISale } from '../models/Sale';
import { SaleResponseDTO } from '../dtos/SaleDTO';

export class SaleMapper {
    static toDTO(sale: ISale): SaleResponseDTO {
        return {
            id: sale._id.toString(),
            customerName: sale.customerName,
            customerId: sale.customerId ? sale.customerId.toString() : undefined,
            items: sale.items.map(item => ({
                productId: item.productId.toString(),
                productName: item.productName,
                quantity: item.quantity,
                priceAtSale: item.priceAtSale,
            })),
            totalAmount: sale.totalAmount,
            saleDate: sale.saleDate.toISOString(),
            paymentMethod: sale.paymentMethod,
            createdAt: sale.createdAt.toISOString(),
            updatedAt: sale.updatedAt.toISOString(),
        };
    }
}
