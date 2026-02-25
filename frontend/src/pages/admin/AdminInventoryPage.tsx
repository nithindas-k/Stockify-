import React, { useEffect, useState } from 'react';
import { AdminSidebar, AdminSidebarToggleBtn } from '../../components/admin/AdminSidebar';
import { useAuthStore } from '../../store/authStore';
import { Plus, Package, PackageOpen, LayoutGrid, Search, MoreHorizontal, Edit, Trash2, Bell } from 'lucide-react';
import { inventoryService } from '../../services/inventory/inventoryService';
import { toast } from 'sonner';

// Shadcn components
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Spinner } from '../../components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

interface Product {
    _id: string;
    name: string;
    sku: string;
    category: string;
    quantity: number;
    price: number;
    lowStockThreshold: number;
    description: string;
}

const AdminInventoryPage: React.FC = () => {
    const user = useAuthStore((s) => s.user);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '', sku: '', category: '', quantity: 0, price: 0, lowStockThreshold: 10, description: ''
    });
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await inventoryService.getAll({ search });
            setProducts(res.data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [search]);

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingId(product._id);
            setFormData(product);
        } else {
            setEditingId(null);
            setFormData({ name: '', sku: '', category: '', quantity: 0, price: 0, lowStockThreshold: 10, description: '' });
        }
        setIsAddModalOpen(true);
    };

    const handleSaveProduct = async () => {
        if (!formData.name || !formData.sku || !formData.category) {
            toast.error('Please fill all required fields');
            return;
        }

        setSaving(true);
        try {
            if (editingId) {
                await inventoryService.update(editingId, formData);
                toast.success('Product updated successfully');
            } else {
                await inventoryService.create(formData as any);
                toast.success('Product added successfully');
            }
            setIsAddModalOpen(false);
            fetchProducts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await inventoryService.delete(id);
            toast.success('Product deleted');
            fetchProducts();
        } catch (error: any) {
            toast.error('Failed to delete product');
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
                        Inventory Management
                    </span>
                    <div className="flex-1" />

                    <button className="relative p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
                        <Bell className="size-4" />
                    </button>
                    <div className="size-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-amber-400">
                            {user?.name?.[0]?.toUpperCase() ?? 'A'}
                        </span>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                    {/* Top Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or SKU..."
                                className="pl-9 bg-card border-border border-white/5"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button variant="outline" className="gap-2 shrink-0">
                                <LayoutGrid className="w-4 h-4" />
                                Export
                            </Button>

                            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => handleOpenModal()} className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(157,0,255,0.3)] shrink-0 w-full sm:w-auto">
                                        <Plus className="w-4 h-4" />
                                        Add Item
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] bg-card border-border">
                                    <DialogHeader>
                                        <DialogTitle>{editingId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">Name <span className="text-red-500">*</span></Label>
                                            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3 border-border bg-background" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="sku" className="text-right">SKU <span className="text-red-500">*</span></Label>
                                            <Input id="sku" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="col-span-3 border-border bg-background" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="category" className="text-right">Category <span className="text-red-500">*</span></Label>
                                            <div className="col-span-3">
                                                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                                                    <SelectTrigger className="border-border bg-background">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Electronics">Electronics</SelectItem>
                                                        <SelectItem value="Clothing">Clothing</SelectItem>
                                                        <SelectItem value="Food">Food</SelectItem>
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="price" className="text-right">Price</Label>
                                            <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="col-span-3 border-border bg-background" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="qty" className="text-right">Quantity</Label>
                                            <Input id="qty" type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })} className="col-span-3 border-border bg-background" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                        <Button onClick={handleSaveProduct} disabled={saving} className="bg-primary hover:bg-primary/90 text-white">
                                            {saving ? <Spinner /> : 'Save changes'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-xl border border-white/10 bg-card overflow-hidden shadow-lg">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="hover:bg-transparent border-white/10">
                                    <TableHead className="font-semibold text-foreground">Product</TableHead>
                                    <TableHead className="font-semibold text-foreground">SKU / Category</TableHead>
                                    <TableHead className="font-semibold text-foreground text-right">Price</TableHead>
                                    <TableHead className="font-semibold text-foreground text-right">Stock</TableHead>
                                    <TableHead className="font-semibold text-foreground text-right">Status</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center">
                                            <Spinner className="mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                                            <PackageOpen className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                            No products found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.map((product) => (
                                        <TableRow key={product._id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors">
                                                        <Package className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-foreground">{product.name}</div>
                                                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{product.description || 'No description'}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-foreground">{product.sku}</div>
                                                <div className="text-xs text-muted-foreground">{product.category}</div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                ${product.price.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {product.quantity}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {product.quantity === 0 ? (
                                                    <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-none border-red-500/20">Out of Stock</Badge>
                                                ) : product.quantity <= product.lowStockThreshold ? (
                                                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 shadow-none border-amber-500/20">Low Stock</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-none border-emerald-500/20">In Stock</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-card border-border">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleOpenModal(product)} className="cursor-pointer gap-2 focus:bg-white/5">
                                                            <Edit className="w-4 h-4 text-muted-foreground" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteProduct(product._id)} className="cursor-pointer gap-2 text-red-500 focus:bg-red-500/10 focus:text-red-500">
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default AdminInventoryPage;
