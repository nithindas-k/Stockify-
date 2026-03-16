import { SaleResponseDTO } from './SaleDTO';
import { ProductResponseDTO } from './ProductDTO';
import { CustomerResponseDTO } from './CustomerDTO';

export interface ReportSummaryDTO {
    totalRevenue?: number;
    totalSales?: number;
    totalItems?: number;
    totalValue?: number;
    lowStockItems?: number;
}

export interface SalesReportResponseDTO {
    summary: {
        totalRevenue: number;
        totalSales: number;
    };
    sales: SaleResponseDTO[];
}

export interface InventoryReportResponseDTO {
    summary: {
        totalItems: number;
        totalValue: number;
        lowStockItems: number;
    };
    items: ProductResponseDTO[];
}

export interface LedgerReportResponseDTO {
    customer: CustomerResponseDTO;
    summary: {
        totalSpent: number;
    };
    transactions: SaleResponseDTO[];
}
