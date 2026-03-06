import React, { useEffect, useState } from 'react';
import { UserSidebar, SidebarToggleBtn } from '../../components/user/UserSidebar';
import { useAuthStore } from '../../store/authStore';
import { FileText, TrendingUp, PackageSearch, Users, Download, Printer, Mail, LayoutGrid } from 'lucide-react';
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
    const getReportTitle = () => activeTab === 'sales' ? 'Sales Report' : activeTab === 'items' ? 'Inventory Items Report' : 'Customer Ledger';

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
        const table = document.getElementById(getTableId());
        if (!table) return toast.error("No data available to export.");
        const doc = new jsPDF();
        doc.text(getReportTitle(), 14, 15);
        autoTable(doc, { html: `#${getTableId()}`, startY: 20 });
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
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #6366f1; color: #1f2937;">Date</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #6366f1; color: #1f2937;">Amount</th>
                `;
                tableRows = salesReport.sales.map((s: any) => `
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-family: monospace; font-size: 12px;">TXN-${s._id.slice(-6).toUpperCase()}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${s.customerName}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">${new Date(s.saleDate).toLocaleDateString()}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #6366f1;">₹${s.totalAmount?.toFixed(2)}</td>
                    </tr>
                `).join('');
                summaryStats = `
                    <div style="display: inline-block; width: 45%; background: #f3f4f6; padding: 15px; border-radius: 10px; margin-right: 10px;">
                        <div style="font-size: 12px; color: #6b7280;">Total Revenue</div>
                        <div style="font-size: 20px; font-weight: bold; color: #111827;">₹${salesReport.summary?.totalRevenue?.toFixed(2)}</div>
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
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #10b981;">₹${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                `).join('');
                summaryStats = `
                    <div style="display: inline-block; width: 30%; background: #f3f4f6; padding: 10px; border-radius: 10px; margin-right: 5px;">
                        <div style="font-size: 10px; color: #6b7280;">Catalog</div>
                        <div style="font-size: 16px; font-weight: bold; color: #111827;">${itemsReport.summary?.totalItems}</div>
                    </div>
                    <div style="display: inline-block; width: 30%; background: #f3f4f6; padding: 10px; border-radius: 10px; margin-right: 5px;">
                        <div style="font-size: 10px; color: #6b7280;">Net Value</div>
                        <div style="font-size: 16px; font-weight: bold; color: #111827;">₹${itemsReport.summary?.totalValue?.toFixed(0)}</div>
                    </div>
                    <div style="display: inline-block; width: 30%; background: #f3f4f6; padding: 10px; border-radius: 10px;">
                        <div style="font-size: 10px; color: #6b7280;">Low Stock</div>
                        <div style="font-size: 16px; font-weight: bold; color: #ef4444;">${itemsReport.summary?.lowStockItems}</div>
                    </div>
                `;
            } else if (activeTab === 'ledger' && ledgerReport) {
                tableHeaders = `
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #6366f1; color: #1f2937;">Date</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #6366f1; color: #1f2937;">TXN ID</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #6366f1; color: #1f2937;">Method</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #6366f1; color: #1f2937;">Amount</th>
                `;
                tableRows = ledgerReport.transactions.map((t: any) => `
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${new Date(t.saleDate).toLocaleDateString()}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-family: monospace; font-size: 12px;">TXN-${t._id.slice(-6).toUpperCase()}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><span style="font-size: 11px; background: #eef2ff; color: #6366f1; padding: 2px 6px; border-radius: 4px;">${t.paymentMethod}</span></td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #111827;">₹${t.totalAmount.toFixed(2)}</td>
                    </tr>
                `).join('');
                summaryStats = `
                    <div style="display: inline-block; width: 45%; background: #f3f4f6; padding: 15px; border-radius: 10px; margin-right: 10px;">
                        <div style="font-size: 12px; color: #6b7280;">Total Purchases</div>
                        <div style="font-size: 20px; font-weight: bold; color: #111827;">${ledgerReport.summary?.totalPurchases}</div>
                    </div>
                    <div style="display: inline-block; width: 45%; background: #f3f4f6; padding: 15px; border-radius: 10px;">
                        <div style="font-size: 12px; color: #6b7280;">Lifetime Value</div>
                        <div style="font-size: 20px; font-weight: bold; color: #6366f1;">₹${ledgerReport.summary?.totalSpent?.toFixed(2)}</div>
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
                subject: `📊 Stockify | ${getReportTitle()} - ${dateStr}`,
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
                                    <Users className="w-4 h-4" /> Ledger
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
                                        <SummaryCard title="Total Revenue" value={`₹${salesReport.summary?.totalRevenue?.toFixed(2) || '0.00'}`} subtitle="Across selected period" />
                                        <SummaryCard title="Total Transactions" value={salesReport.summary?.totalSales || 0} subtitle="Count of completed sales" />
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-card overflow-hidden shadow-lg">
                                        <Table id="sales-table">
                                            <TableHeader className="bg-white/5">
                                                <TableRow className="border-white/10">
                                                    <TableHead>Transaction</TableHead>
                                                    <TableHead>Customer</TableHead>
                                                    <TableHead>Items Count</TableHead>
                                                    <TableHead className="text-right">Total Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {pagedSales.length === 0 ? (
                                                    <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No sales found.</TableCell></TableRow>
                                                ) : (
                                                    pagedSales.map((s: any) => (
                                                        <TableRow key={s._id} className="border-white/5">
                                                            <TableCell>
                                                                <div className="font-semibold text-xs tracking-wider">TXN-{s._id.slice(-6).toUpperCase()}</div>
                                                                <div className="text-[10px] text-muted-foreground">{new Date(s.saleDate).toLocaleString()}</div>
                                                            </TableCell>
                                                            <TableCell>{s.customerName}</TableCell>
                                                            <TableCell>{s.items?.length}</TableCell>
                                                            <TableCell className="text-right font-medium text-primary">₹{s.totalAmount?.toFixed(2)}</TableCell>
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
                                <Spinner className="mx-auto" />
                            ) : itemsReport ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <SummaryCard title="Total Catalog Items" value={itemsReport.summary?.totalItems || 0} />
                                        <SummaryCard title="Inventory Value" value={`₹${itemsReport.summary?.totalValue?.toFixed(2) || '0.00'}`} subtitle="Capital locked in stock" />
                                        <SummaryCard title="Low Stock Warnings" value={itemsReport.summary?.lowStockItems || 0} subtitle="Items below threshold" />
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-card overflow-hidden shadow-lg">
                                        <Table id="items-table">
                                            <TableHeader className="bg-white/5">
                                                <TableRow className="border-white/10">
                                                    <TableHead>Product</TableHead>
                                                    <TableHead>Category</TableHead>
                                                    <TableHead className="text-right">Stock Level</TableHead>
                                                    <TableHead className="text-right">Stock Value</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {pagedItems.length === 0 ? (
                                                    <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No items found.</TableCell></TableRow>
                                                ) : (
                                                    pagedItems.map((item: any) => (
                                                        <TableRow key={item._id} className="border-white/5">
                                                            <TableCell>
                                                                <div className="font-medium">{item.name}</div>
                                                                <div className="text-[10px] text-muted-foreground max-w-[200px] truncate">{item.description}</div>
                                                            </TableCell>
                                                            <TableCell><Badge variant="outline" className="text-[10px]">{item.category}</Badge></TableCell>
                                                            <TableCell className="text-right">
                                                                <span className={item.quantity <= item.lowStockThreshold ? 'text-destructive font-bold' : ''}>
                                                                    {item.quantity}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-right font-medium text-emerald-500">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                                                        </TableRow>
                                                    ))
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
                                <h3 className="text-lg font-medium">Customer Selection</h3>
                                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                                    <SelectTrigger className="w-full max-w-md bg-background border-border">
                                        <SelectValue placeholder="Search or select a customer to view ledger..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c: any) => (
                                            <SelectItem key={c._id} value={c._id}>{c.name} ({c.mobile})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {ledgerLoading ? (
                                <Spinner className="mx-auto mt-8" />
                            ) : ledgerReport && selectedCustomerId ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <SummaryCard title="Lifetime Purchases" value={ledgerReport.summary?.totalPurchases || 0} />
                                        <SummaryCard title="Lifetime Spent" value={`₹${ledgerReport.summary?.totalSpent?.toFixed(2) || '0.00'}`} />
                                    </div>

                                    <div className="rounded-xl border border-white/10 bg-card overflow-hidden shadow-lg mt-6">
                                        <Table id="ledger-table">
                                            <TableHeader className="bg-white/5">
                                                <TableRow className="border-white/10">
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Transaction ID</TableHead>
                                                    <TableHead>Payment Method</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {pagedLedger.length === 0 ? (
                                                    <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No transactions found for this customer.</TableCell></TableRow>
                                                ) : (
                                                    pagedLedger.map((t: any) => (
                                                        <TableRow key={t._id} className="border-white/5">
                                                            <TableCell className="text-sm">{new Date(t.saleDate).toLocaleDateString()}</TableCell>
                                                            <TableCell className="font-semibold text-xs tracking-wider">TXN-{t._id.slice(-6).toUpperCase()}</TableCell>
                                                            <TableCell><Badge variant="outline" className="text-[10px]">{t.paymentMethod}</Badge></TableCell>
                                                            <TableCell className="text-right font-medium text-primary">₹{t.totalAmount.toFixed(2)}</TableCell>
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
                                        <TableHead>Items Count</TableHead>
                                        <TableHead>Total Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {salesReport.sales.map((s: any) => (
                                        <TableRow key={s._id}>
                                            <TableCell>TXN-{s._id.slice(-6).toUpperCase()}</TableCell>
                                            <TableCell>{new Date(s.saleDate).toLocaleString()}</TableCell>
                                            <TableCell>{s.customerName}</TableCell>
                                            <TableCell>{s.items?.length}</TableCell>
                                            <TableCell>₹{s.totalAmount?.toFixed(2)}</TableCell>
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
                                        <TableRow key={item._id}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.sku}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>₹{item.price?.toFixed(2)}</TableCell>
                                            <TableCell>₹{(item.price * item.quantity).toFixed(2)}</TableCell>
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
                                        <TableHead>Payment Method</TableHead>
                                        <TableHead>Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ledgerReport.transactions.map((t: any) => (
                                        <TableRow key={t._id}>
                                            <TableCell>{new Date(t.saleDate).toLocaleDateString()}</TableCell>
                                            <TableCell>TXN-{t._id.slice(-6).toUpperCase()}</TableCell>
                                            <TableCell>{t.paymentMethod}</TableCell>
                                            <TableCell>₹{t.totalAmount.toFixed(2)}</TableCell>
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
