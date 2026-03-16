import React, { useEffect, useState } from 'react';
import { UserSidebar, SidebarToggleBtn } from '../../components/user/UserSidebar';
import { useAuthStore } from '../../store/authStore';
import { FileText, TrendingUp, PackageSearch, Users, Download, Printer, Mail, LayoutGrid, Package, ChevronDown, ChevronUp, Trophy, Zap, Ghost, AlertCircle } from 'lucide-react';
import { reportService } from '../../services/report/reportService';
import { customerService } from '../../services/customer/customerService';
import { toast } from 'sonner';
import { NotificationBell } from '../../components/notifications/NotificationBell';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { usePagination } from '../../hooks/usePagination';
import { PaginationControls } from '../../components/common/PaginationControls';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Spinner } from '../../components/ui/spinner';
import { Badge } from '../../components/ui/badge';

interface SummaryCardProps {
    title: string;
    value: React.ReactNode;
    subtitle?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = React.memo(({ title, value, subtitle }) => (
    <div className="bg-card border border-white/10 rounded-xl p-5 shadow-lg flex flex-col justify-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
));

const ReportsPage: React.FC = () => {
    const user = useAuthStore((s) => s.user);

    const [salesReport, setSalesReport] = useState<any>(null);
    const [salesLoading, setSalesLoading] = useState(false);

    const [itemsReport, setItemsReport] = useState<any>(null);
    const [itemsLoading, setItemsLoading] = useState(false);


    const [ledgerReport, setLedgerReport] = useState<any>(null);
    const [ledgerLoading, setLedgerLoading] = useState(false);


    const [customers, setCustomers] = useState<any[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [activeTab, setActiveTab] = useState('sales');

    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');
    const [emailing, setEmailing] = useState(false);

    // Smart Product Analytics calculation
    const analytics = React.useMemo(() => {
        if (!salesReport || !itemsReport) return null;

        const sales = salesReport.sales || [];
        const products = itemsReport.items || [];
        const productStats: Record<string, { qty: number, revenue: number, name: string }> = {};

        sales.forEach((sale: any) => {
            sale.items?.forEach((item: any) => {
                const id = item.productId?.id || item.productId;
                if (!id) return;
                if (!productStats[id]) {
                    productStats[id] = { qty: 0, revenue: 0, name: item.productName || item.productId?.name || 'Unknown' };
                }
                productStats[id].qty += item.quantity;
                productStats[id].revenue += (item.priceAtSale || item.quantityPrice / item.quantity || 0) * item.quantity;
            });
        });

        const sortedByQty = Object.values(productStats).sort((a, b) => b.qty - a.qty);
        const bestSeller = sortedByQty[0] || null;

        const soldProductIds = new Set(Object.keys(productStats));
        const deadStock = products.filter((p: any) => !soldProductIds.has(p.id));

        return {
            bestSeller,
            deadStockCount: deadStock.length,
            productSales: productStats
        };
    }, [salesReport, itemsReport]);

    // Toggle state for expandable lists
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const fetchSales = async () => {
        setSalesLoading(true);
        try {
            const res = await reportService.getSalesReport();
            setSalesReport(res.data.data || res.data);
        } catch (error: any) {
            toast.error('Failed to load Sales Report');
        } finally {
            setSalesLoading(false);
        }
    };

    const fetchItems = async () => {
        setItemsLoading(true);
        try {
            const res = await reportService.getInventoryReport();
            setItemsReport(res.data.data || res.data);
        } catch (error: any) {
            toast.error('Failed to load Items Report');
        } finally {
            setItemsLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const res = await customerService.getAll();
            setCustomers(res.data.data || res.data);
        } catch (error) { }
    };

    const fetchLedger = async (customerId: string) => {
        if (!customerId) return;
        setLedgerLoading(true);
        try {
            const res = await reportService.getCustomerLedger(customerId);
            setLedgerReport(res.data.data || res.data);
        } catch (error: any) {
            toast.error('Failed to load Customer Ledger');
            setLedgerReport(null);
        } finally {
            setLedgerLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
        fetchItems();
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (selectedCustomerId) {
            fetchLedger(selectedCustomerId);
        }
    }, [selectedCustomerId]);

    // Pagination for Sales Tab
    const {
        currentPage: salesPage,
        totalPages: salesTotalPages,
        currentData: pagedSales,
        goToPage: goSalesPage
    } = usePagination(salesReport?.sales || [], 6);

    // Pagination for Items Tab
    const {
        currentPage: itemsPage,
        totalPages: itemsTotalPages,
        currentData: pagedItems,
        goToPage: goItemsPage
    } = usePagination(itemsReport?.items || [], 6);

    // Pagination for Ledger Tab
    const {
        currentPage: ledgerPage,
        totalPages: ledgerTotalPages,
        currentData: pagedLedger,
        goToPage: goLedgerPage
    } = usePagination(ledgerReport?.transactions || [], 6);


    const getTableId = () => `${activeTab}-table-full`;
    const getReportTitle = () => activeTab === 'sales' ? 'Sales Report' : activeTab === 'items' ? 'Inventory Items Report' : 'Customer History Report';

    const handlePrint = () => {
        const table = document.getElementById(getTableId());
        if (!table) return toast.error("No data available to print in this tab.");
        const printWindow = window.open('', '', 'height=600,width=800');
        if (!printWindow) return;
        printWindow.document.write(`<html><head><title>${getReportTitle()}</title>`);
        printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(`<h2>${getReportTitle()}</h2>`);
        printWindow.document.write(table.outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text(getReportTitle(), 14, 15);

        let head: string[][] = [];
        let body: any[][] = [];

        if (activeTab === 'sales') {
            if (!salesReport?.sales?.length) return toast.error("No data available to export.");
            head = [['Transaction ID', 'Date', 'Customer', 'Items List', 'Total Amount']];
            body = salesReport.sales.map((s: any) => [
                `TXN-${s.id.slice(-6).toUpperCase()}`,
                new Date(s.saleDate).toLocaleString(),
                s.customerName,
                s.items?.map((i: any) => `${i.productName || i.productId?.name || 'Unknown'} (${i.quantity} x Rs.${i.priceAtSale})`).join(', ') || '',
                `Rs.${s.totalAmount?.toFixed(2) || '0.00'}`
            ]);
        } else if (activeTab === 'items') {
            if (!itemsReport?.items?.length) return toast.error("No data available to export.");
            head = [['Product', 'SKU', 'Category', 'Stock Level', 'Price', 'Total Value']];
            body = itemsReport.items.map((item: any) => [
                item.name,
                item.sku,
                item.category || 'N/A',
                item.quantity?.toString() || '0',
                `Rs.${item.price?.toFixed(2) || '0.00'}`,
                `Rs.${((item.price || 0) * (item.quantity || 0)).toFixed(2)}`
            ]);
        } else if (activeTab === 'ledger') {
            if (!ledgerReport?.transactions?.length) return toast.error("No data available to export.");
            head = [['Date', 'Transaction ID', 'Items List', 'Payment', 'Amount']];
            body = ledgerReport.transactions.map((t: any) => [
                new Date(t.saleDate).toLocaleDateString(),
                `TXN-${t.id.slice(-6).toUpperCase()}`,
                t.items?.map((i: any) => `${i.productName || i.productId?.name || 'Item'} (${i.quantity} x Rs.${i.priceAtSale})`).join(', ') || '',
                t.paymentMethod || 'Unknown',
                `Rs.${t.totalAmount?.toFixed(2) || '0.00'}`
            ]);
        } else {
            return toast.error("Unsupported report type for PDF export.");
        }

        autoTable(doc, {
            head,
            body,
            startY: 20,
            styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
            headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 247, 250] },
            margin: { top: 20, left: 14, right: 14 }
        });

        doc.save(`${activeTab}_report.pdf`);
        toast.success("PDF Downloaded");
    };

    const handleExportExcel = () => {
        const table = document.getElementById(getTableId());
        if (!table) return toast.error("No data available to export.");
        const wb = XLSX.utils.table_to_book(table, { sheet: "Report" });
        XLSX.writeFile(wb, `${activeTab}_report.xlsx`);
        toast.success("Excel Downloaded");
    };

    const handleSendEmail = async () => {
        if (!emailAddress) return toast.error("Enter a valid email address");
        setEmailing(true);
        try {
            const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
            let tableRows = '';
            let tableHeaders = '';
            let summaryStats = '';

            // Generate content based on active tab
            if (activeTab === 'sales' && salesReport) {
                tableHeaders = `
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #6366f1; color: #1f2937;">ID</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #6366f1; color: #1f2937;">Customer</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #6366f1; color: #1f2937;">Purchased Items</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #6366f1; color: #1f2937;">Total</th>
                `;
                tableRows = salesReport.sales.map((s: any) => {
                    const itemsList = s.items.map((i: any) =>
                        `<div style="font-size: 11px; margin-bottom: 2px;">
                            â€¢ ${i.productName || i.productId?.name || 'Unknown Product'}
                            <span style="color: #6b7280;">(x${i.quantity} @ â‚¹${i.priceAtSale})</span>
                            = <b>â‚¹${(i.quantity * i.priceAtSale).toFixed(2)}</b>
                        </div>`
                    ).join('');

                    return `
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-family: monospace; font-size: 12px;">
                            TXN-${s.id.slice(-6).toUpperCase()}
                            <div style="font-size: 10px; color: #9ca3af;">${new Date(s.saleDate).toLocaleDateString()}</div>
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${s.customerName}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${itemsList}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #6366f1;">â‚¹${s.totalAmount?.toFixed(2)}</td>
                    </tr>
                `}).join('');
                summaryStats = `
                    <div style="display: inline-block; width: 45%; background: #f3f4f6; padding: 15px; border-radius: 10px; margin-right: 10px;">
                        <div style="font-size: 12px; color: #6b7280;">Total Revenue</div>
                        <div style="font-size: 20px; font-weight: bold; color: #111827;">â‚¹${salesReport.summary?.totalRevenue?.toFixed(2)}</div>
                    </div>
                    <div style="display: inline-block; width: 45%; background: #f3f4f6; padding: 15px; border-radius: 10px;">
                        <div style="font-size: 12px; color: #6b7280;">Transactions</div>
                        <div style="font-size: 20px; font-weight: bold; color: #111827;">${salesReport.summary?.totalSales}</div>
                    </div>
                `;
            } else if (activeTab === 'items' && itemsReport) {
                tableHeaders = `
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #6366f1; color: #1f2937;">Product</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #6366f1; color: #1f2937;">SKU</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #6366f1; color: #1f2937;">Stock</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #6366f1; color: #1f2937;">Valuation</th>
                `;
                tableRows = itemsReport.items.map((item: any) => `
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                            <div style="font-weight: bold;">${item.name}</div>
                            <div style="font-size: 11px; color: #9ca3af;">${item.category}</div>
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-family: monospace; font-size: 12px;">${item.sku}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
                            <span style="color: ${item.quantity <= item.lowStockThreshold ? '#ef4444' : '#111827'}; font-weight: ${item.quantity <= item.lowStockThreshold ? 'bold' : 'normal'}">
                                ${item.quantity}
                            </span>
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #10b981;">â‚¹${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                `).join('');
                summaryStats = `
                    <div style="display: inline-block; width: 30%; background: #f3f4f6; padding: 10px; border-radius: 10px; margin-right: 5px;">
                        <div style="font-size: 10px; color: #6b7280;">Catalog</div>
                        <div style="font-size: 16px; font-weight: bold; color: #111827;">${itemsReport.summary?.totalItems}</div>
                    </div>
                    <div style="display: inline-block; width: 30%; background: #f3f4f6; padding: 10px; border-radius: 10px; margin-right: 5px;">
                        <div style="font-size: 10px; color: #6b7280;">Net Value</div>
                        <div style="font-size: 16px; font-weight: bold; color: #111827;">â‚¹${itemsReport.summary?.totalValue?.toFixed(0)}</div>
                    </div>
                    <div style="display: inline-block; width: 30%; background: #f3f4f6; padding: 10px; border-radius: 10px;">
                        <div style="font-size: 10px; color: #6b7280;">Low Stock</div>
                        <div style="font-size: 16px; font-weight: bold; color: #ef4444;">${itemsReport.summary?.lowStockItems}</div>
                    </div>
                `;
            } else if (activeTab === 'ledger' && ledgerReport) {
                tableHeaders = `
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #6366f1; color: #1f2937;">Date</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #6366f1; color: #1f2937;">Reference (Items)</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #6366f1; color: #1f2937;">Mode</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #6366f1; color: #1f2937;">Amount</th>
                `;

                tableRows = ledgerReport.transactions.map((t: any) => {
                    const itemsList = t.items.map((i: any) =>
                        `<div style="font-size: 10px; color: #64748b;">â€¢ ${i.productName || i.productId?.name} (x${i.quantity})</div>`
                    ).join('');

                    return `
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 12px;">${new Date(t.saleDate).toLocaleDateString()}</td>
                            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                                <div style="font-weight: bold; color: #1e293b; font-size: 11px;">REF: ${t.id.slice(-6).toUpperCase()}</div>
                                ${itemsList}
                            </td>
                            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
                                <span style="background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid #e2e8f0;">${t.paymentMethod}</span>
                            </td>
                            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #111827;">â‚¹${t.totalAmount.toFixed(2)}</td>
                        </tr>
                    `;
                }).join('');

                summaryStats = `
                    <div style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="font-size: 14px; color: #1e293b; font-weight: bold;">Statement of Account: ${ledgerReport.customer?.name}</div>
                        <div style="font-size: 12px; color: #64748b;">${ledgerReport.customer?.address || 'N/A'} | ${ledgerReport.customer?.mobile || 'N/A'}</div>
                        <div style="margin-top: 10px; display: flex; gap: 20px;">
                            <div>
                                <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Total Billing</div>
                                <div style="font-size: 18px; font-weight: bold; color: #1e293b;">â‚¹${ledgerReport.summary?.totalSpent?.toFixed(2)}</div>
                            </div>
                            <div>
                                <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Account Balance</div>
                                <div style="font-size: 18px; font-weight: bold; color: #10b981;">â‚¹0.00</div>
                            </div>
                        </div>
                    </div>
                `;
            }

            const htmlContent = `
                <div style="background-color: #f9fafb; padding: 40px 10px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <div style="background-color: #6366f1; padding: 30px; text-align: center; color: #ffffff;">
                            <div style="font-size: 24px; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 4px;">STOCKIFY</div>
                            <div style="font-size: 14px; opacity: 0.9;">Business Intelligence Platform</div>
                        </div>

                        <!-- Content Body -->
                        <div style="padding: 30px;">
                            <div style="margin-bottom: 25px;">
                                <h1 style="font-size: 20px; margin: 0; color: #111827;">${getReportTitle()}</h1>
                                <p style="font-size: 14px; color: #6b7280; margin-top: 5px;">Report generated on ${dateStr}</p>
                            </div>

                            <!-- Summary Area -->
                            <div style="margin-bottom: 30px; text-align: center;">
                                ${summaryStats}
                            </div>

                            <!-- Data Table -->
                            <div style="overflow-x: auto;">
                                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #374151;">
                                    <thead>
                                        <tr>
                                            ${tableHeaders}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${tableRows || '<tr><td colspan="100" style="text-align: center; padding: 20px; color: #9ca3af;">No data available for this period</td></tr>'}
                                    </tbody>
                                </table>
                            </div>

                            <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px; color: #6b7280; font-size: 12px; text-align: center;">
                                <p>This report contains confidential business data meant only for the authorized recipient.</p>
                                <p style="margin-top: 10px; font-weight: bold;">&copy; 2026 Stockify ERP Solutions. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            await reportService.emailReport({
                email: emailAddress,
                subject: `ðŸ“Š Stockify | ${getReportTitle()} - ${dateStr}`,
                htmlContent
            });
            toast.success("Report emailed securely!");
            setIsEmailModalOpen(false);
            setEmailAddress('');
        } catch (error: any) {
            console.error('Email report error:', error);
            const errMsg = error.response?.data?.error || error.response?.data?.message || "Failed to email report";
            toast.error(errMsg);
        } finally {
            setEmailing(false);
        }
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
            <UserSidebar />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border/40 bg-background/80 backdrop-blur-sm px-4">
                    <SidebarToggleBtn />
                    <div className="h-5 w-px bg-border/50 hidden sm:block" />
                    <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                        Analytics & Reports
                    </span>
                    <div className="flex-1" />
                    <NotificationBell />
                    <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                            {user?.name?.[0]?.toUpperCase() ?? 'U'}
                        </span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <TabsList className="bg-card border border-white/10 p-1 flex w-full max-w-md">
                                <TabsTrigger value="sales" className="flex-1 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                                    <TrendingUp className="w-4 h-4" /> Sales
                                </TabsTrigger>
                                <TabsTrigger value="items" className="flex-1 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                                    <PackageSearch className="w-4 h-4" /> Items
                                </TabsTrigger>
                                <TabsTrigger value="ledger" className="flex-1 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                                    <Users className="w-4 h-4" /> History
                                </TabsTrigger>
                            </TabsList>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2 border-primary/50 text-primary hover:bg-primary/10">
                                        <Download className="w-4 h-4" /> Export Report
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                                    <DropdownMenuLabel>Share Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={handlePrint} className="cursor-pointer gap-2">
                                        <Printer className="w-4 h-4" /> Print Document
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer gap-2 text-red-400 focus:text-red-400">
                                        <FileText className="w-4 h-4" /> Export as PDF
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer gap-2 text-emerald-400 focus:text-emerald-400">
                                        <LayoutGrid className="w-4 h-4" /> Export to Excel
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setIsEmailModalOpen(true)} className="cursor-pointer gap-2 text-blue-400 focus:text-blue-400">
                                        <Mail className="w-4 h-4" /> Email Report
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* --- SALES REPORT TAB --- */}
                        <TabsContent value="sales" className="space-y-6 animate-in fade-in-50 zoom-in-95 duration-300">
                            {salesLoading ? (
                                <Spinner className="mx-auto" />
                            ) : salesReport ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <SummaryCard title="Total Revenue" value={`â‚¹${salesReport.summary?.totalRevenue?.toFixed(2) || '0.00'}`} subtitle="Across selected period" />
                                        <SummaryCard title="Total Transactions" value={salesReport.summary?.totalSales || 0} subtitle="Count of completed sales" />
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-card overflow-hidden shadow-lg">
                                        <Table id="sales-table">
                                            <TableHeader className="bg-white/5">
                                                <TableRow className="border-white/10">
                                                    <TableHead>Transaction</TableHead>
                                                    <TableHead>Customer</TableHead>
                                                    <TableHead>Product Details (Qty x Price)</TableHead>
                                                    <TableHead className="text-right">Total Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {pagedSales.length === 0 ? (
                                                    <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No sales found.</TableCell></TableRow>
                                                ) : (
                                                    pagedSales.map((s: any) => (
                                                        <TableRow key={s.id} className="border-white/5">
                                                            <TableCell>
                                                                <div className="font-semibold text-xs tracking-wider">TXN-{s.id.slice(-6).toUpperCase()}</div>
                                                                <div className="text-[10px] text-muted-foreground">{new Date(s.saleDate).toLocaleString()}</div>
                                                            </TableCell>
                                                            <TableCell>{s.customerName}</TableCell>
                                                            <TableCell className="min-w-[250px] align-top">
                                                                <div className="flex flex-col gap-1.5 py-1">
                                                                    {(expandedRows[s.id] ? s.items : s.items?.slice(0, 1))?.map((item: any, idx: number) => (
                                                                        <div key={idx} className="group relative flex items-center gap-2 rounded-lg bg-primary/5 p-1.5 border border-primary/10 transition-all hover:bg-primary/10 hover:border-primary/20">
                                                                            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/10 text-primary shadow-sm">
                                                                                <Package className="size-3.5" />
                                                                            </div>
                                                                            <div className="flex flex-1 flex-col min-w-0">
                                                                                <span className="truncate text-[11px] font-semibold text-foreground">
                                                                                    {item.productName || item.productId?.name || 'Unknown Product'}
                                                                                </span>
                                                                                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-medium">
                                                                                    <span>{item.quantity} units</span>
                                                                                    <span className="size-0.5 rounded-full bg-muted-foreground/30"></span>
                                                                                    <span>â‚¹{item.priceAtSale}/unit</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-[11px] font-bold text-primary">
                                                                                â‚¹{(item.quantity * item.priceAtSale).toFixed(0)}
                                                                            </div>
                                                                        </div>
                                                                    ))}

                                                                    {s.items?.length > 1 && (
                                                                        <button
                                                                            onClick={() => toggleRow(s.id)}
                                                                            className="flex items-center gap-1 text-[10px] font-semibold text-primary/70 hover:text-primary mt-1 px-1 transition-colors group/btn"
                                                                        >
                                                                            {expandedRows[s.id] ? (
                                                                                <><ChevronUp className="size-3" /> Show Less</>
                                                                            ) : (
                                                                                <><ChevronDown className="size-3 group-hover/btn:translate-y-0.5 transition-transform" /> {s.items.length - 1} more items</>
                                                                            )}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right font-medium text-primary">â‚¹{s.totalAmount?.toFixed(2)}</TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <PaginationControls
                                        currentPage={salesPage}
                                        totalPages={salesTotalPages}
                                        onPageChange={goSalesPage}
                                    />
                                </>
                            ) : null}
                        </TabsContent>

                        {/* --- ITEMS REPORT TAB --- */}
                        <TabsContent value="items" className="space-y-6 animate-in fade-in-50 zoom-in-95 duration-300">
                            {itemsLoading ? (
                                <Spinner className="mx-auto mt-12" />
                            ) : itemsReport ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                                            <Trophy className="absolute -right-2 -bottom-2 size-16 text-amber-500/10 group-hover:scale-110 transition-transform" />
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-500/70 mb-1 flex items-center gap-1.5">
                                                <Trophy className="size-3" /> Best Seller
                                            </h3>
                                            <p className="text-lg font-black text-foreground truncate">{analytics?.bestSeller?.name || 'N/A'}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1 font-bold">{analytics?.bestSeller?.qty || 0} units sold recently</p>
                                        </div>

                                        <div className="bg-card border border-white/10 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                                            <Zap className="absolute -right-2 -bottom-2 size-16 text-primary/10 group-hover:scale-110 transition-transform" />
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-1 flex items-center gap-1.5">
                                                <Zap className="size-3" /> Inventory Value
                                            </h3>
                                            <p className="text-xl font-black text-foreground">â‚¹{itemsReport.summary?.totalValue?.toLocaleString() || '0'}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1 font-bold">Capital locked in stock</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-red-500/10 to-pink-500/5 border border-red-500/20 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                                            <AlertCircle className="absolute -right-2 -bottom-2 size-16 text-red-500/10 group-hover:scale-110 transition-transform" />
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-red-500/70 mb-1 flex items-center gap-1.5">
                                                <AlertCircle className="size-3" /> Low Stock
                                            </h3>
                                            <p className="text-2xl font-black text-red-500">{itemsReport.summary?.lowStockItems || 0}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1 font-bold">Items needing restock</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/5 border border-indigo-500/20 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                                            <Ghost className="absolute -right-2 -bottom-2 size-16 text-indigo-500/10 group-hover:scale-110 transition-transform" />
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-500/70 mb-1 flex items-center gap-1.5">
                                                <Ghost className="size-3" /> Dead Stock
                                            </h3>
                                            <p className="text-2xl font-black text-foreground">{analytics?.deadStockCount || 0}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1 font-bold">No sales in 30 days</p>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-white/10 bg-card overflow-hidden shadow-2xl">
                                        <Table id="items-table">
                                            <TableHeader className="bg-white/5 uppercase">
                                                <TableRow className="border-white/10">
                                                    <TableHead className="text-[10px]">Product & Performance</TableHead>
                                                    <TableHead className="text-[10px]">Status</TableHead>
                                                    <TableHead className="text-[10px] text-right">Units Sold</TableHead>
                                                    <TableHead className="text-[10px] text-right">Stock Level</TableHead>
                                                    <TableHead className="text-[10px] text-right">Valuation</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {pagedItems.length === 0 ? (
                                                    <TableRow><TableCell colSpan={5} className="text-center py-16 text-muted-foreground opacity-30 italic">No inventory data available.</TableCell></TableRow>
                                                ) : (
                                                    pagedItems.map((item: any) => {
                                                        const sold = analytics?.productSales[item.id]?.qty || 0;
                                                        const isDead = sold === 0;
                                                        const isLow = item.quantity <= item.lowStockThreshold;

                                                        return (
                                                            <TableRow key={item.id} className="border-white/5 transition-colors hover:bg-white/[0.02] group">
                                                                <TableCell className="py-4">
                                                                    <div className="space-y-1">
                                                                        <div className="font-black text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                                                                            {item.name}
                                                                            {sold > 10 && <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px] h-3.5 px-1 py-0 uppercase font-black">Hot</Badge>}
                                                                        </div>
                                                                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter flex items-center gap-2">
                                                                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 border-white/10">{item.category}</Badge>
                                                                            {item.description && <span>â€¢ {item.description.slice(0, 30)}...</span>}
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {isLow ? (
                                                                        <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px] uppercase font-black py-0">Critical</Badge>
                                                                    ) : isDead ? (
                                                                        <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 text-[9px] uppercase font-black py-0">Dead</Badge>
                                                                    ) : (
                                                                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] uppercase font-black py-0">Healthy</Badge>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="text-right py-4">
                                                                    <div className="font-mono text-xs font-black text-foreground">{sold}</div>
                                                                </TableCell>
                                                                <TableCell className="text-right py-4">
                                                                    <div className={`font-mono text-xs font-black ${isLow ? 'text-red-500 animate-pulse' : 'text-foreground/70'}`}>
                                                                        {item.quantity}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-right py-4">
                                                                    <div className="font-black text-xs text-emerald-500">
                                                                        â‚¹{(item.price * item.quantity).toFixed(0)}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <PaginationControls
                                        currentPage={itemsPage}
                                        totalPages={itemsTotalPages}
                                        onPageChange={goItemsPage}
                                    />
                                </>
                            ) : null}
                        </TabsContent>

                        {/* --- CUSTOMER LEDGER TAB --- */}
                        <TabsContent value="ledger" className="space-y-6 animate-in fade-in-50 zoom-in-95 duration-300">
                            <div className="bg-card border border-white/10 rounded-xl p-6 shadow-lg space-y-4">
                                <h3 className="text-lg font-medium text-foreground/80">Select Customer</h3>
                                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                                    <SelectTrigger className="w-full max-w-md bg-background/50 border-white/10">
                                        <SelectValue placeholder="Begin typing customer name..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c: any) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name} ({c.mobile})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {ledgerLoading ? (
                                <Spinner className="mx-auto mt-8" />
                            ) : ledgerReport && selectedCustomerId ? (
                                <>
                                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <Users className="size-24" />
                                        </div>
                                        <div className="space-y-1 relative z-10">
                                            <div className="text-[10px] uppercase tracking-widest font-black text-primary/60">Customer Statement</div>
                                            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                                                {ledgerReport.customer?.name}
                                                <Badge variant="outline" className="text-[10px] uppercase py-0">{ledgerReport.customer?.mobile}</Badge>
                                            </h2>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <LayoutGrid className="size-3" /> {ledgerReport.customer?.address}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8 relative z-10">
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Total Billing</p>
                                                <p className="text-xl font-black text-foreground">â‚¹{ledgerReport.summary?.totalSpent?.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Visit Count</p>
                                                <p className="text-xl font-black text-foreground">{ledgerReport.transactions?.length || 0} Sales</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-white/10 bg-card overflow-hidden shadow-lg mt-6">
                                        <Table id="ledger-table">
                                            <TableHeader className="bg-white/5 uppercase">
                                                <TableRow className="border-white/10 uppercase">
                                                    <TableHead className="text-[10px]">Date</TableHead>
                                                    <TableHead className="text-[10px]">Reference & Items</TableHead>
                                                    <TableHead className="text-[10px] text-center">Payment Mode</TableHead>
                                                    <TableHead className="text-[10px] text-right">Total Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {pagedLedger.length === 0 ? (
                                                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground opacity-50 italic">No financial transactions found for this period.</TableCell></TableRow>
                                                ) : (
                                                    pagedLedger.map((t: any) => (
                                                        <TableRow key={t.id} className="border-white/5 transition-colors hover:bg-white/[0.02]">
                                                            <TableCell className="text-[11px] py-4">{new Date(t.saleDate).toLocaleDateString()}</TableCell>
                                                            <TableCell className="align-top py-4 min-w-[300px]">
                                                                <div className="flex flex-col gap-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <FileText className="size-3 text-primary" />
                                                                        <span className="font-mono text-[10px] font-black text-foreground tracking-widest">
                                                                            REF-{t.id.slice(-6).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                    <div className="space-y-1.5 pl-4 border-l border-white/10">
                                                                        {t.items?.map((item: any, idx: number) => (
                                                                            <div key={idx} className="flex items-center justify-between text-[11px]">
                                                                                <span className="text-muted-foreground font-medium">
                                                                                    {item.productName || item.productId?.name || 'Product'}
                                                                                    <span className="ml-2 text-[9px] text-primary/60 font-black">x{item.quantity}</span>
                                                                                </span>
                                                                                <span className="text-[10px] font-bold text-foreground/80">â‚¹{(item.priceAtSale || item.productId?.price || 0).toFixed(2)}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-center py-4">
                                                                <Badge variant="outline" className="text-[10px] uppercase font-black px-2 py-0 border-primary/20 bg-primary/5 text-primary">
                                                                    {t.paymentMethod}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right py-4 font-black text-foreground text-sm">
                                                                â‚¹{t.totalAmount.toFixed(2)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <PaginationControls
                                        currentPage={ledgerPage}
                                        totalPages={ledgerTotalPages}
                                        onPageChange={goLedgerPage}
                                    />
                                </>
                            ) : selectedCustomerId ? (
                                <div className="text-center text-muted-foreground mt-12 flex flex-col items-center">
                                    <FileText className="w-12 h-12 mb-4 opacity-20" />
                                    <p>Select a customer to view their transactions.</p>
                                </div>
                            ) : null}
                        </TabsContent>
                    </Tabs>

                    {/* Email Modal */}
                    <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
                        <DialogContent className="bg-card border-border rounded-xl">
                            <DialogHeader>
                                <DialogTitle>Email Report</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <Input
                                    className="bg-background border-border"
                                    placeholder="Enter email address"
                                    type="email"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>Cancel</Button>
                                <Button disabled={emailing || !emailAddress} onClick={handleSendEmail} className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(157,0,255,0.3)]">
                                    {emailing ? <Spinner /> : 'Send Email'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Hidden Tables for Exporting All Data (No Pagination) */}
                    <div className="hidden" aria-hidden="true">
                        {salesReport?.sales && (
                            <Table id="sales-table-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Transaction ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Items Detailed List</TableHead>
                                        <TableHead>Total Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {salesReport.sales.map((s: any) => (
                                        <TableRow key={s.id}>
                                            <TableCell>TXN-{s.id.slice(-6).toUpperCase()}</TableCell>
                                            <TableCell>{new Date(s.saleDate).toLocaleString()}</TableCell>
                                            <TableCell>{s.customerName}</TableCell>
                                            <TableCell>
                                                {s.items?.map((i: any) =>
                                                    `${i.productName || i.productId?.name || 'Unknown'} (${i.quantity} x â‚¹${i.priceAtSale} = â‚¹${(i.quantity * i.priceAtSale).toFixed(2)})`
                                                ).join('; ')}
                                            </TableCell>
                                            <TableCell>â‚¹{s.totalAmount?.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {itemsReport?.items && (
                            <Table id="items-table-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Stock Level</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Total Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {itemsReport.items.map((item: any) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.sku}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>â‚¹{item.price?.toFixed(2)}</TableCell>
                                            <TableCell>â‚¹{(item.price * item.quantity).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {ledgerReport?.transactions && (
                            <Table id="ledger-table-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Transaction ID</TableHead>
                                        <TableHead>Items Detailed</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ledgerReport.transactions.map((t: any) => (
                                        <TableRow key={t.id}>
                                            <TableCell>{new Date(t.saleDate).toLocaleDateString()}</TableCell>
                                            <TableCell>TXN-{t.id.slice(-6).toUpperCase()}</TableCell>
                                            <TableCell>
                                                {t.items?.map((i: any) =>
                                                    `${i.productName || i.productId?.name || 'Item'} (${i.quantity} x â‚¹${i.priceAtSale})`
                                                ).join('; ')}
                                            </TableCell>
                                            <TableCell>{t.paymentMethod}</TableCell>
                                            <TableCell>â‚¹{t.totalAmount.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default ReportsPage;
