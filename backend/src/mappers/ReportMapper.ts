import { ISale } from '../models/Sale';
import { IProduct } from '../models/Product';
import { 
    SalesReportResponseDTO, 
    InventoryReportResponseDTO, 
    LedgerReportResponseDTO 
} from '../dtos/ReportDTO';
import { SaleMapper } from './SaleMapper';
import { ProductMapper } from './ProductMapper';
import { CustomerMapper } from './CustomerMapper';
import { ICustomer } from '../models/Customer';

export class ReportMapper {
    static toSalesReportDTO(
        sales: ISale[], 
        totalRevenue: number, 
        totalSales: number
    ): SalesReportResponseDTO {
        return {
            summary: {
                totalRevenue,
                totalSales,
            },
            sales: sales.map(SaleMapper.toDTO)
        };
    }

    static toInventoryReportDTO(
        items: IProduct[],
        totalItems: number,
        totalValue: number,
        lowStockItems: number
    ): InventoryReportResponseDTO {
        return {
            summary: {
                totalItems,
                totalValue,
                lowStockItems,
            },
            items: items.map(ProductMapper.toDTO)
        };
    }

    static toLedgerReportDTO(
        customer: ICustomer,
        transactions: ISale[],
        totalSpent: number
    ): LedgerReportResponseDTO {
        return {
            customer: CustomerMapper.toDTO(customer),
            summary: {
                totalSpent,
            },
            transactions: transactions.map(SaleMapper.toDTO)
        };
    }
}
