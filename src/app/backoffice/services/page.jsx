"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState([]);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/services");

            if (!res.ok) throw new Error("Failed to fetch services");
            const data = await res.json();
            setServices(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete service");

            toast.success("Service deleted successfully");
            setServices((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete service");
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "title",
                header: ({ column }) => (
                    <div
                        className="flex items-center gap-2 cursor-pointer select-none group"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Title
                        <ArrowUpDown size={14} className="invisible group-hover:visible" />
                    </div>
                ),
                cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
            },
            {
                accessorKey: "slug",
                header: "Slug",
            },
            {
                accessorKey: "createdAt",
                header: "Created At",
                cell: ({ row }) => {
                    return new Date(row.getValue("createdAt")).toLocaleDateString("th-TH");
                },
            },
            {
                accessorKey: "updatedAt",
                header: "Last Updated",
                cell: ({ row }) => {
                    return new Date(row.getValue("updatedAt")).toLocaleDateString("th-TH");
                },
            },
            {
                id: "actions",
                header: () => <div className="text-right">Actions</div>,
                cell: ({ row }) => (
                    <div className="flex items-center justify-end gap-2">
                        <Link href={`/backoffice/services/${row.original.id}`}>
                            <Button variant="outline" size="sm">
                                <Edit size={16} className="mr-1" /> Edit
                            </Button>
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="ml-2">
                                    <Trash size={16} className="mr-1" /> Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <p>This action cannot be undone.</p>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(row.original.id)}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: services,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Services</h1>
                    <p className="text-gray-500">Manage your services content</p>
                </div>
                <Link href="/backoffice/services/create">
                    <Button>
                        <Plus size={18} className="mr-2" /> Add Service
                    </Button>
                </Link>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <Loader2 className="animate-spin inline-block mr-2" />
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No services found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
