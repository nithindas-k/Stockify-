import React, { useEffect, useState } from 'react';
import { AdminSidebar, AdminSidebarToggleBtn } from '../../components/admin/AdminSidebar';
import { useAuthStore } from '../../store/authStore';
import { FileText, TrendingUp, PackageSearch, Users, Bell, Download, Printer, Mail, LayoutGrid } from 'lucide-react';
import { reportService } from '../../services/report/reportService';
import { customerService } from '../../services/customer/customerService';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Shadcn components
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

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtitle }) => (
    <div className="bg-card border border-white/10 rounded-xl p-5 shadow-lg flex flex-col justify-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
);

const AdminReportsPage: React.FC = () => {
    const adminUser = useAuthStore((s) => s.user);

    // Sales Report state
    const [salesReport, setSalesReport] = useState<any>(null);
    const [salesLoading, setSalesLoading] = useState(false);

    // Items Report state
    const [itemsReport, setItemsReport] = useState<any>(null);
    const [itemsLoading, setItemsLoading] = useState(false);

    // Customer Ledger state
    const [ledgerReport, setLedgerReport] = useState<any>(null);
    const [ledgerLoading, setLedgerLoading] = useState(false);

    // Dependencies
    const [customers, setCustomers] = useState<any[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [activeTab, setActiveTab] = useState('sales');

    // Email Modal State
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

    // Export Utils
    const getTableId = () => `${activeTab}-table`;
    const getReportTitle = () => activeTab === 'sales' ? 'Global Executive Sales Report' : activeTab === 'items' ? 'Global Inventory Report' : 'Customer Ledger';

    const handlePrint = () => {
        const table = document.getElementById(getTableId());
        if (!table) return toast.error("No data available to print in this tab.");
        const printWindow = window.open('', '', 'height=600,width=800');
        if (!printWindow) return;
        printWindow.document.write(`<html><head><title>${getReportTitle()}</title>`);
        printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(`<h2>Stockify ${getReportTitle()}</h2>`);
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
        doc.text(`Stockify ${getReportTitle()}`, 14, 15);
        autoTable(doc, { html: `#${getTableId()}`, startY: 20 });
        doc.save(`Stockify_${activeTab}_report.pdf`);
        toast.success("PDF Downloaded");
    };

    const handleExportExcel = () => {
        const table = document.getElementById(getTableId());
        if (!table) return toast.error("No data available to export.");
        const wb = XLSX.utils.table_to_book(table, { sheet: "Report" });
        XLSX.writeFile(wb, `Stockify_${activeTab}_report.xlsx`);
        toast.success("Excel Downloaded");
    };

    const handleSendEmail = async () => {
        if (!emailAddress) return toast.error("Enter a valid email address");
        const table = document.getElementById(getTableId());
        if (!table) return toast.error("No data available to email.");

        setEmailing(true);
        try {
            const htmlContent = `
                <h2>Stockify ${getReportTitle()}</h2>
                <table style="width: 100%; border-collapse: collapse; font-family: sans-serif;">
                    ${table.innerHTML}
                </table>
               <style>th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }</style>
            `;
            await reportService.emailReport({
                email: emailAddress,
                subject: `Stockify - ${getReportTitle()}`,
                htmlContent
            });
            toast.success("Report emailed securely!");
            setIsEmailModalOpen(false);
            setEmailAddress('');
        } catch (error: any) {
            toast.error("Failed to email report");
        } finally {
            setEmailing(false);
        }
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
            <AdminSidebar />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border/40 bg-background/80 backdrop-blur-sm px-4">
                    <AdminSidebarToggleBtn />
                    <div className="h-5 w-px bg-border/50 hidden sm:block" />
                    <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                        Executive Reports & Analytics
                    </span>
                    <div className="flex-1" />
                    <button className="relative p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
                        <Bell className="size-4" />
                    </button>
                    <div className="size-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-amber-400">
                            {adminUser?.name?.[0]?.toUpperCase() ?? 'A'}
                        </span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <TabsList className="bg-card border border-white/10 p-1 flex w-full max-w-md">
                                <TabsTrigger value="sales" className="flex-1 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                                    <TrendingUp className="w-4 h-4" /> Global Sales
                                </TabsTrigger>
                                <TabsTrigger value="items" className="flex-1 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                                    <PackageSearch className="w-4 h-4" /> Inventory
                                </TabsTrigger>
                                <TabsTrigger value="ledger" className="flex-1 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                                    <Users className="w-4 h-4" /> CRM Ledger
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
                                        <SummaryCard title="Enterprise Revenue" value={`₹${salesReport.summary?.totalRevenue?.toFixed(2) || '0.00'}`} subtitle="All time global revenue" />
                                        <SummaryCard title="Total Transactions" value={salesReport.summary?.totalSales || 0} subtitle="Count of completed sales globally" />
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
                                                {salesReport.sales?.length === 0 ? (
                                                    <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No sales found.</TableCell></TableRow>
                                                ) : (
                                                    salesReport.sales?.map((s: any) => (
                                                        <TableRow key={s._id} className="border-white/5 hover:bg-white/5 transition-colors group">
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
                                        <SummaryCard title="Global Catalog Items" value={itemsReport.summary?.totalItems || 0} />
                                        <SummaryCard title="Enterprise Inventory Value" value={`₹${itemsReport.summary?.totalValue?.toFixed(2) || '0.00'}`} subtitle="Capital locked in stock globally" />
                                        <SummaryCard title="Low Stock Warnings" value={itemsReport.summary?.lowStockItems || 0} subtitle="Items below threshold globally" />
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-card overflow-hidden shadow-lg">
                                        <Table id="items-table">
                                            <TableHeader className="bg-white/5">
                                                <TableRow className="border-white/10">
                                                    <TableHead>Product</TableHead>
                                                    <TableHead>Category</TableHead>
                                                    <TableHead className="text-right">Global Stock Level</TableHead>
                                                    <TableHead className="text-right">Stock Value</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {itemsReport.items?.length === 0 ? (
                                                    <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No items found.</TableCell></TableRow>
                                                ) : (
                                                    itemsReport.items?.map((item: any) => (
                                                        <TableRow key={item._id} className="border-white/5 hover:bg-white/5 transition-colors group">
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
                                </>
                            ) : null}
                        </TabsContent>

                        {/* --- CUSTOMER LEDGER TAB --- */}
                        <TabsContent value="ledger" className="space-y-6 animate-in fade-in-50 zoom-in-95 duration-300">
                            <div className="bg-card border border-white/10 rounded-xl p-6 shadow-lg space-y-4">
                                <h3 className="text-lg font-medium">Customer Operations Ledger</h3>
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
                                                {ledgerReport.transactions?.length === 0 ? (
                                                    <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No transactions found for this customer.</TableCell></TableRow>
                                                ) : (
                                                    ledgerReport.transactions?.map((t: any) => (
                                                        <TableRow key={t._id} className="border-white/5 hover:bg-white/5 transition-colors group">
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
                                <DialogTitle>Email Global Report</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <Input
                                    className="bg-background border-border"
                                    placeholder="Enter executive email address"
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

                </main>
            </div>
        </div>
    );
};

export default AdminReportsPage;
