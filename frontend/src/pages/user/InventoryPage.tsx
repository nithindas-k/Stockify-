import React, { useEffect, useState } from 'react';
import { UserSidebar, SidebarToggleBtn } from '../../components/user/UserSidebar';
import { useAuthStore } from '../../store/authStore';
import { Package, PackageOpen, LayoutGrid, Search, Bell } from 'lucide-react';
import { inventoryService } from '../../services/inventory/inventoryService';
import { toast } from 'sonner';

// Shadcn components
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Spinner } from '../../components/ui/spinner';

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

const InventoryPage: React.FC = () => {
    const user = useAuthStore((s) => s.user);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

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

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">

            <UserSidebar />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border/40 bg-background/80 backdrop-blur-sm px-4">
                    <SidebarToggleBtn />

                    <div className="h-5 w-px bg-border/50 hidden sm:block" />
                    <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                        Inventory Catalog
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

                        <div className="grid grid-cols-1 w-full sm:flex sm:w-auto">
                            <Button variant="outline" className="w-full gap-2 justify-center sm:w-auto border-white/10 hover:bg-white/5 text-muted-foreground hover:text-foreground">
                                <LayoutGrid className="w-4 h-4 shrink-0" />
                                <span className="truncate">Export</span>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile & Tablet Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 xl:hidden">
                        {loading ? (
                            <div className="col-span-full py-12 flex justify-center">
                                <Spinner className="mx-auto" />
                            </div>
                        ) : products.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-xl border border-white/10">
                                <PackageOpen className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                No products found
                            </div>
                        ) : (
                            products.map((product) => (
                                <div key={product._id} className="bg-card rounded-xl border border-white/10 p-5 shadow-lg flex flex-col gap-4 relative group hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-3 pr-8">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                            <Package className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-semibold text-foreground truncate">{product.name}</div>
                                            <div className="text-xs text-muted-foreground truncate">{product.sku}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm bg-background/50 p-3 rounded-lg border border-white/5 mt-auto">
                                        <div>
                                            <span className="text-muted-foreground text-[10px] uppercase tracking-wider block mb-0.5">Category</span>
                                            <span className="font-medium text-xs truncate max-w-[100px] block">{product.category}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground text-[10px] uppercase tracking-wider block mb-0.5">Price</span>
                                            <span className="font-medium text-xs">${product.price.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground text-[10px] uppercase tracking-wider block mb-0.5">Stock</span>
                                            <span className="font-medium text-xs">{product.quantity}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground text-[10px] uppercase tracking-wider block mb-0.5">Status</span>
                                            {product.quantity === 0 ? (
                                                <Badge variant="destructive" className="bg-red-500/10 text-red-500 shadow-none border-red-500/20 px-1.5 py-0 text-[10px]">Out of Stock</Badge>
                                            ) : product.quantity <= product.lowStockThreshold ? (
                                                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 shadow-none border-amber-500/20 px-1.5 py-0 text-[10px]">Low Stock</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 shadow-none border-emerald-500/20 px-1.5 py-0 text-[10px]">In Stock</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop Table (Hidden on smaller screens) */}
                    <div className="hidden xl:block rounded-xl border border-white/10 bg-card overflow-hidden shadow-lg">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="hover:bg-transparent border-white/10">
                                    <TableHead className="font-semibold text-foreground">Product</TableHead>
                                    <TableHead className="font-semibold text-foreground">SKU / Category</TableHead>
                                    <TableHead className="font-semibold text-foreground text-right">Price</TableHead>
                                    <TableHead className="font-semibold text-foreground text-right">Stock</TableHead>
                                    <TableHead className="font-semibold text-foreground text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center">
                                            <Spinner className="mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
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

export default InventoryPage;
