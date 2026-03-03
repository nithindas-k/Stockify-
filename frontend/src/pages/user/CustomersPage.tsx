import React, { useEffect, useState } from 'react';
import { UserSidebar, SidebarToggleBtn } from '../../components/user/UserSidebar';
import { useAuthStore } from '../../store/authStore';
import { Plus, Users, UserX, LayoutGrid, Search, MoreHorizontal, Edit, Trash2, Phone, MapPin } from 'lucide-react';
import { customerService } from '../../services/customer/customerService';
import { toast } from 'sonner';
import { NotificationBell } from '../../components/notifications/NotificationBell';
import { usePagination } from '../../hooks/usePagination';
import { PaginationControls } from '../../components/common/PaginationControls';


import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { Label } from '../../components/ui/label';
import { Spinner } from '../../components/ui/spinner';

interface Customer {
    _id: string;
    name: string;
    mobile: string;
    address: string;
    createdAt: string;
}

const CustomersPage: React.FC = () => {
    const user = useAuthStore((s) => s.user);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');


    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Customer>>({
        name: '', mobile: '', address: ''
    });
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await customerService.getAll({ search });
            setCustomers(res.data.data || res.data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [search]);

    const handleOpenModal = (customer?: Customer) => {
        if (customer) {
            setEditingId(customer._id);
            setFormData(customer);
        } else {
            setEditingId(null);
            setFormData({ name: '', mobile: '', address: '' });
        }
        setIsAddModalOpen(true);
    };

    const handleSaveCustomer = async () => {
        if (!formData.name || !formData.mobile || !formData.address) {
            toast.error('Please fill all required fields');
            return;
        }

        setSaving(true);
        try {
            if (editingId) {
                await customerService.update(editingId, formData);
                toast.success('Customer updated successfully');
            } else {
                await customerService.create(formData as any);
                toast.success('Customer added successfully');
            }
            setIsAddModalOpen(false);
            fetchCustomers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save customer');
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = (id: string) => {
        setCustomerToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteCustomer = async () => {
        if (!customerToDelete) return;
        try {
            await customerService.delete(customerToDelete);
            toast.success('Customer deleted');
            fetchCustomers();
        } catch (error: any) {
            toast.error('Failed to delete customer');
        } finally {
            setIsDeleteDialogOpen(false);
            setCustomerToDelete(null);
        }
    };


    const safeCustomers = Array.isArray(customers) ? customers : [];

    const {
        currentPage,
        totalPages,
        currentData: pagedCustomers,
        goToPage
    } = usePagination(safeCustomers, 6);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">

            <UserSidebar />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border/40 bg-background/80 backdrop-blur-sm px-4">
                    <SidebarToggleBtn />

                    <div className="h-5 w-px bg-border/50 hidden sm:block" />
                    <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                        Customers List
                    </span>
                    <div className="flex-1" />

                    <NotificationBell />

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
                                placeholder="Search by name, mobile, or address..."
                                className="pl-9 bg-card border-border border-white/5"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full sm:flex sm:w-auto">
                            <Button variant="outline" className="w-full gap-2 justify-center sm:w-auto border-white/10 hover:bg-white/5 text-muted-foreground hover:text-foreground">
                                <LayoutGrid className="w-4 h-4 shrink-0" />
                                <span className="truncate">Export</span>
                            </Button>

                            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => handleOpenModal()} className="w-full gap-2 bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(157,0,255,0.3)] justify-center sm:w-auto">
                                        <Plus className="w-4 h-4 shrink-0" />
                                        <span className="truncate">Add Customer</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-[95vw] max-w-[425px] bg-card border-border rounded-xl">
                                    <DialogHeader>
                                        <DialogTitle>{editingId ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-3 py-4 max-h-[65vh] overflow-y-auto px-1 snap-y">
                                        <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4 snap-start">
                                            <Label htmlFor="name" className="sm:text-right font-medium">Name <span className="text-red-500">*</span></Label>
                                            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="sm:col-span-3 border-border bg-background" />
                                        </div>
                                        <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4 snap-start">
                                            <Label htmlFor="mobile" className="sm:text-right font-medium">Mobile <span className="text-red-500">*</span></Label>
                                            <Input id="mobile" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} className="sm:col-span-3 border-border bg-background" />
                                        </div>
                                        <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4 snap-start">
                                            <Label htmlFor="address" className="sm:text-right font-medium">Address <span className="text-red-500">*</span></Label>
                                            <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="sm:col-span-3 border-border bg-background" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                        <Button onClick={handleSaveCustomer} disabled={saving} className="bg-primary hover:bg-primary/90 text-white">
                                            {saving ? <Spinner /> : 'Save changes'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogContent className="bg-card border-border rounded-xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the customer record.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-transparent border-white/10 text-foreground hover:bg-white/5">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteCustomer} className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(157,0,255,0.3)]">Delete Customer</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Mobile & Tablet Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 xl:hidden">
                        {loading ? (
                            <div className="col-span-full py-12 flex justify-center">
                                <Spinner className="mx-auto" />
                            </div>
                        ) : pagedCustomers.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-xl border border-white/10">
                                <UserX className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                No customers found
                            </div>
                        ) : (
                            pagedCustomers.map((customer) => (
                                <div key={customer._id} className="bg-card rounded-xl border border-white/10 p-5 shadow-lg flex flex-col gap-4 relative group hover:border-primary/30 transition-colors">
                                    <div className="absolute top-3 right-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 text-muted-foreground">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-card border-border">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleOpenModal(customer)} className="cursor-pointer gap-2 focus:bg-white/5">
                                                    <Edit className="w-4 h-4 text-muted-foreground" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => confirmDelete(customer._id)} className="cursor-pointer gap-2 text-primary focus:bg-primary/10 focus:text-primary">
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex items-center gap-3 pr-8">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                            <Users className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-semibold text-foreground truncate">{customer.name}</div>
                                            <div className="text-xs text-muted-foreground truncate">{new Date(customer.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 text-sm bg-background/50 p-3 rounded-lg border border-white/5 mt-auto">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="w-4 h-4 shrink-0" />
                                            <span className="font-medium text-foreground truncate">{customer.mobile}</span>
                                        </div>
                                        <div className="flex items-start gap-2 text-muted-foreground">
                                            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                                            <span className="font-medium text-foreground line-clamp-2">{customer.address}</span>
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
                                    <TableHead className="font-semibold text-foreground">Customer</TableHead>
                                    <TableHead className="font-semibold text-foreground">Mobile</TableHead>
                                    <TableHead className="font-semibold text-foreground">Address</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center">
                                            <Spinner className="mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : pagedCustomers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-40 text-center text-muted-foreground">
                                            <UserX className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                            No customers found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pagedCustomers.map((customer) => (
                                        <TableRow key={customer._id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors">
                                                        <Users className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-foreground">{customer.name}</div>
                                                        <div className="text-xs text-muted-foreground">{new Date(customer.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                                    <span className="font-medium text-foreground">{customer.mobile}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                                                    <div className="text-foreground max-w-[300px] truncate" title={customer.address}>
                                                        {customer.address}
                                                    </div>
                                                </div>
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
                                                        <DropdownMenuItem onClick={() => handleOpenModal(customer)} className="cursor-pointer gap-2 focus:bg-white/5">
                                                            <Edit className="w-4 h-4 text-muted-foreground" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => confirmDelete(customer._id)} className="cursor-pointer gap-2 text-primary focus:bg-primary/10 focus:text-primary">
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

                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={goToPage}
                    />

                </main>
            </div>
        </div>
    );
};

export default CustomersPage;
