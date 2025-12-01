"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PagesManagement() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPages = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/pages");
            if (res.ok) {
                const data = await res.json();
                setPages(data);
            }
        } catch (error) {
            console.error("Error fetching pages:", error);
            toast.error("Failed to fetch pages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Pages Management</h1>
                    <p className="text-gray-500">Manage your website pages content</p>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center">
                                    <div className="flex justify-center items-center">
                                        <Loader2 className="animate-spin text-gray-500" size={24} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : pages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center py-8">
                                    No pages found
                                </TableCell>
                            </TableRow>
                        ) : (
                            pages.map((page) => (
                                <TableRow key={page.id}>
                                    <TableCell className="font-medium">{page.title}</TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/backoffice/pages/${page.slug}`}>
                                                <Edit size={16} /> Edit Content
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
