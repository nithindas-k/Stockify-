import React, { useEffect, useState } from 'react';
import { UserSidebar, SidebarToggleBtn } from '../../components/user/UserSidebar';
import { useAuthStore } from '../../store/authStore';
import { Plus, ShoppingCart, ShoppingBag, Search, Bell, MapPin, SearchX } from 'lucide-react';
import { saleService } from '../../services/sale/saleService';
import { inventoryService } from '../../services/inventory/inventoryService';
import { customerService } from '../../services/customer/customerService';
import { toast } from 'sonner';

// Shadcn components
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Spinner } from '../../components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';

interface Product {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    sku: string;
}

interface Customer {
    _id: string;
    name: string;
    mobile: string;
}

interface Sale {
    _id: string;
    customerName: string;
    totalAmount: number;
    saleDate: string;
    paymentMethod: string;
    items: {
        productId: { name: string, _id: string };
        quantity: number;
        priceAtSale: number;
    }[];
}

const SalesPage: React.FC = () => {
    const user = useAuthStore((s) => s.user);
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Form Data
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Selectors Data
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [allCustomers, setAllCustomers] = useState<Customer[]>([]);

    const [formCustomerName, setFormCustomerName] = useState('');
    const [formCustomerId, setFormCustomerId] = useState<string>('cash');
    const [formPaymentMethod, setFormPaymentMethod] = useState<'Cash' | 'Card' | 'UPI' | 'Other'>('Cash');

    const [formItems, setFormItems] = useState<{ productId: string, quantity: number, pricePerUnit: number }[]>([]);

    // Fetch Base
    const fetchSales = async () => {
        setLoading(true);
        try {
            const res = await saleService.getAll({ search });
            setSales(res.data.data || res.data);
        } catch (error: any) {
            toast.error('Failed to load sales');
        } finally {
            setLoading(false);
        }
    };

    const fetchDependencies = async () => {
        try {
            const prodRes = await inventoryService.getAll();
            const custRes = await customerService.getAll();
            setAllProducts(prodRes.data);
            setAllCustomers(custRes.data.data || custRes.data);
        } catch (error: unknown) { }
    }

    useEffect(() => {
        fetchSales();
        fetchDependencies();
    }, [search]);

    // Handle form opens
    const handleOpenModal = () => {
        setFormCustomerName('Walk-in Customer');
        setFormCustomerId('cash');
        setFormPaymentMethod('Cash');
        setFormItems([]);
        setIsAddModalOpen(true);
    };

    const handleCustomerChange = (val: string) => {
        setFormCustomerId(val);
        if (val === 'cash') {
            setFormCustomerName('Walk-in Customer');
        } else {
            const c = allCustomers.find(x => x._id === val);
            if (c) setFormCustomerName(c.name);
        }
    }

    const addItemLine = () => {
        setFormItems([...formItems, { productId: '', quantity: 1, pricePerUnit: 0 }]);
    }

    const updateItemLine = (index: number, field: string, value: any) => {
        const newItems = [...formItems];
        if (field === 'productId') {
            const product = allProducts.find(p => p._id === value);
            newItems[index].productId = value;
            if (product) {
                newItems[index].pricePerUnit = product.price; // Auto-fill current price
            }
        } else {
            newItems[index] = { ...newItems[index], [field]: value };
        }
        setFormItems(newItems);
    }

    const removeItemLine = (index: number) => {
        setFormItems(formItems.filter((_, i) => i !== index));
    }


    const handleSaveSale = async () => {
        if (formItems.length === 0) {
            toast.error('Please add at least one item');
            return;
        }

        const invalidItems = formItems.some(i => !i.productId || i.quantity <= 0);
        if (invalidItems) {
            toast.error('Please select valid products and positive quantities');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                customerName: formCustomerName,
                customerId: formCustomerId === 'cash' ? undefined : formCustomerId,
                paymentMethod: formPaymentMethod,
                items: formItems.map(i => ({ productId: i.productId, quantity: i.quantity }))
            };

            await saleService.create(payload);
            toast.success('Sale successfully recorded!');
            setIsAddModalOpen(false);
            fetchSales();
            fetchDependencies(); // refresh stock numbers secretly behind the scenes
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to record sale');
        } finally {
            setSaving(false);
        }
    };


    const safeSales = Array.isArray(sales) ? sales : [];

    // Calculate modal running total
    const modalTotal = formItems.reduce((acc, curr) => acc + (curr.pricePerUnit * curr.quantity), 0);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">

            <UserSidebar />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border/40 bg-background/80 backdrop-blur-sm px-4">
                    <SidebarToggleBtn />

                    <div className="h-5 w-px bg-border/50 hidden sm:block" />
                    <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                        Sales Operations
                    </span>
                    <div className="flex-1" />

                    <button className="relative p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
                        <Bell className="size-4" />
                    </button>
                    <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                            {user?.name?.[0]?.toUpperCase() ?? 'U'}
                        </span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                    {/* Top Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search sales by customer..."
                                className="pl-9 bg-card border-border border-white/5"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full sm:flex sm:w-auto">
                            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={handleOpenModal} className="w-full gap-2 bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(157,0,255,0.3)] justify-center sm:w-auto">
                                        <ShoppingCart className="w-4 h-4 shrink-0" />
                                        <span className="truncate">Record New Sale</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-[95vw] max-w-[600px] bg-card border-border rounded-xl">
                                    <DialogHeader>
                                        <DialogTitle>Point of Sale Register</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4 max-h-[65vh] overflow-y-auto px-1 snap-y">

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Customer</Label>
                                                <Select value={formCustomerId} onValueChange={handleCustomerChange}>
                                                    <SelectTrigger className="border-border bg-background">
                                                        <SelectValue placeholder="Select Customer" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="cash" className="font-bold text-primary">Cash / Walk-in</SelectItem>
                                                        {allCustomers.map(c => (
                                                            <SelectItem key={c._id} value={c._id}>{c.name} ({c.mobile})</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Payment Method</Label>
                                                <Select value={formPaymentMethod} onValueChange={(v: any) => setFormPaymentMethod(v)}>
                                                    <SelectTrigger className="border-border bg-background">
                                                        <SelectValue placeholder="Payment Method" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Cash">Cash</SelectItem>
                                                        <SelectItem value="Card">Card</SelectItem>
                                                        <SelectItem value="UPI">UPI</SelectItem>
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {formCustomerId === 'cash' && (
                                                <div className="col-span-2 space-y-2">
                                                    <Label>Walk-in Customer Name</Label>
                                                    <Input
                                                        value={formCustomerName}
                                                        onChange={(e) => setFormCustomerName(e.target.value)}
                                                        placeholder="Name (Optional)"
                                                        className="border-border bg-background"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 border-t border-border pt-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-lg">Shopping Cart</Label>
                                                <Button size="sm" variant="outline" onClick={addItemLine} className="gap-2 h-8 text-xs border-primary/40 hover:bg-primary/20 text-primary">
                                                    <Plus className="w-3 h-3" /> Add Item
                                                </Button>
                                            </div>

                                            {formItems.length === 0 ? (
                                                <div className="text-center py-6 text-sm text-muted-foreground border border-dashed border-white/10 rounded-lg">
                                                    Click "Add Item" to scan an item to the cart.
                                                </div>
                                            ) : (
                                                formItems.map((item, idx) => (
                                                    <div key={idx} className="flex gap-2 items-end bg-background/50 p-3 rounded-lg border border-white/5 relative group">
                                                        <div className="flex-1 space-y-1">
                                                            <Label className="text-xs text-muted-foreground">Product</Label>
                                                            <Select value={item.productId} onValueChange={(v) => updateItemLine(idx, 'productId', v)}>
                                                                <SelectTrigger className="border-border bg-background h-9">
                                                                    <SelectValue placeholder="Select Product" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {allProducts.map(p => (
                                                                        <SelectItem key={p._id} value={p._id} disabled={p.quantity <= 0}>
                                                                            {p.name} - ₹{p.price} {p.quantity <= 0 ? '(Out of Stock)' : `(${p.quantity} in stock)`}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="w-24 space-y-1">
                                                            <Label className="text-xs text-muted-foreground">Qty</Label>
                                                            <Input
                                                                type="number" min="1"
                                                                value={item.quantity}
                                                                onChange={(e) => updateItemLine(idx, 'quantity', Number(e.target.value))}
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <div className="w-24 pb-2.5 text-right font-medium">
                                                            ₹{(item.pricePerUnit * item.quantity).toFixed(2)}
                                                        </div>
                                                        <button
                                                            onClick={() => removeItemLine(idx)}
                                                            className="absolute -top-2 -right-2 bg-card border border-border text-muted-foreground hover:text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        >
                                                            <SearchX className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center px-1 mb-2">
                                        <span className="text-muted-foreground">Total Display:</span>
                                        <span className="text-2xl font-bold text-primary">₹{modalTotal.toFixed(2)}</span>
                                    </div>

                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                        <Button onClick={handleSaveSale} disabled={saving || formItems.length === 0} className="bg-primary hover:bg-primary/90 text-white">
                                            {saving ? <Spinner /> : 'Complete Transaction'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>


                    {/* Desktop Table (Hidden on smaller screens) */}
                    <div className="hidden xl:block rounded-xl border border-white/10 bg-card overflow-hidden shadow-lg">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="hover:bg-transparent border-white/10">
                                    <TableHead className="font-semibold text-foreground">Transaction Details</TableHead>
                                    <TableHead className="font-semibold text-foreground">Customer</TableHead>
                                    <TableHead className="font-semibold text-foreground">Payment</TableHead>
                                    <TableHead className="text-right font-semibold text-foreground">Total Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center">
                                            <Spinner className="mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : safeSales.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-40 text-center text-muted-foreground">
                                            <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                            No sales recorded yet
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    safeSales.map((sale) => (
                                        <TableRow key={sale._id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:border-green-500/50 transition-colors">
                                                        <ShoppingBag className="w-5 h-5 text-green-500" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-foreground text-xs uppercase tracking-wider">TXN-{sale._id.slice(-6)}</div>
                                                        <div className="text-xs text-muted-foreground">{new Date(sale.saleDate).toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-foreground">{sale.customerName}</div>
                                                <div className="text-xs text-muted-foreground">{sale.items.length} items purchased</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-white/10">{sale.paymentMethod}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="font-bold text-lg text-primary">₹{sale.totalAmount.toFixed(2)}</div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>


                    {/* Mobile & Tablet Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 xl:hidden">
                        {loading ? (
                            <div className="col-span-full py-12 flex justify-center">
                                <Spinner className="mx-auto" />
                            </div>
                        ) : safeSales.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-xl border border-white/10">
                                <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                No sales recorded
                            </div>
                        ) : (
                            safeSales.map((sale) => (
                                <div key={sale._id} className="bg-card rounded-xl border border-white/10 p-5 shadow-lg flex flex-col gap-4 relative group hover:border-green-500/30 transition-colors">
                                    <div className="flex items-center gap-3 pr-8">
                                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20 shrink-0">
                                            <ShoppingBag className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-semibold text-foreground truncate">TXN-{sale._id.slice(-6).toUpperCase()}</div>
                                            <div className="text-xs text-muted-foreground truncate">{new Date(sale.saleDate).toLocaleString()}</div>
                                        </div>
                                    </div>

                                    <div className="grid gap-2 text-sm bg-background/50 p-3 rounded-lg border border-white/5 mt-auto">
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground text-xs">Customer</span>
                                            <span className="font-medium">{sale.customerName}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground text-xs">Payment</span>
                                            <Badge variant="outline" className="text-[10px] h-5">{sale.paymentMethod}</Badge>
                                        </div>
                                        <div className="pt-2 mt-2 border-t border-white/5 flex justify-between items-center">
                                            <span className="text-muted-foreground text-xs">Grand Total</span>
                                            <span className="font-bold text-primary">₹{sale.totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default SalesPage;
