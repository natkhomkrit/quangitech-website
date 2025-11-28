"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
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

export default function categories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sorting, setSorting] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setName(selectedCategory.name || "");
      setSlug(selectedCategory.slug || "");
      setDescription(selectedCategory.description || "");
      setIsEditMode(true);
    } else {
      setName("");
      setSlug("");
      setDescription("");
      setIsEditMode(false);
    }
  }, [selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !slug) {
      toast.error("Name and Slug are required");
      return;
    }

    setLoading(true);
    try {
      const isEdit = selectedCategory && selectedCategory.id;
      const url = isEdit
        ? `/api/categories/${selectedCategory.id}`
        : "/api/categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description }),
      });

      if (!res.ok) throw new Error("Failed to save category");

      const savedCategory = await res.json();

      if (isEdit) {
        setCategories((prev) =>
          prev.map((cat) => (cat.id === savedCategory.id ? savedCategory : cat))
        );
        toast.success("Category updated successfully");
      } else {
        setCategories((prev) => [...prev, savedCategory]);
        toast.success("Category created successfully");
      }

      // เคลียร์ฟอร์ม
      setName("");
      setSlug("");
      setDescription("");
      setSelectedCategory(null);
    } catch (error) {
      console.error("Failed to save category:", error);
      toast.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {

    try {
      setLoading(true);
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to delete category");
      }

      toast.success("Category deleted successfully");
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.message || "Error deleting category");
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div
            className="flex items-center gap-2 cursor-pointer select-none group"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown size={14} className="invisible group-hover:visible" />
          </div>
        ),
        cell: ({ row }) => {
          const name = row.getValue("name");
          const id = row.original.id;
          return (
            <div>
              <span className="font-semibold">{name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "slug",
        header: ({ column }) => (
          <div
            className="flex items-center gap-2 cursor-pointer group select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Slug
            <ArrowUpDown size={14} className="invisible group-hover:visible" />
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
          const description = row.getValue("description");
          return (
            <div className={description ? "" : "text-gray-400"}>
              {description || "no description"}
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <div
            className="flex items-center gap-2 cursor-pointer group select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
            <ArrowUpDown size={14} className="invisible group-hover:visible" />
          </div>
        ),
        cell: ({ row }) => {
          const value = row.getValue("createdAt");
          return (
            <div className={value ? "" : "text-center"}>
              {value ? new Date(value).toLocaleDateString() : "-"}
            </div>
          );
        },
      },
      {
        header: "Action",
        cell: ({ row }) => (
          <div className="w-fit">
            <Button
              variant={"outline"}
              size="sm"
              onClick={() => setSelectedCategory(row.original)}
            >
              <Edit /> Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  <Trash size={16} /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <p>This action cannot be undone.</p>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => handleDelete(row.original.id)}
                  >
                    Yes, delete
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
    data: categories,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .normalize("NFC")
      .replace(/\s+/g, "-")
      .replace(/[^\p{L}\p{N}\p{M}-]+/gu, "")
      .replace(/--+/g, "-");
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Manage your post categories
        </p>
      </div>
      <hr />
      <div className="flex flex-col md:flex-row items-start py-4 gap-6">
        {/* Form */}
        <div className="w-full md:w-96 flex flex-col gap-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium mb-2 block">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="slug" className="text-sm font-medium mb-2 block">
              Slug <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <Button
                onClick={() => setSlug(generateSlug(name))}
                disabled={loading}
              >
                Generate
              </Button>
            </div>
          </div>
          <div>
            <Label
              htmlFor="description"
              className="text-sm font-medium mb-2 block"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" onClick={handleSubmit} disabled={loading}>
              {isEditMode ? "Update Category" : "Add Category"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setName("");
                setSlug("");
                setDescription("");
                setSelectedCategory(null);
                setIsEditMode(false);
              }}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 rounded-md border w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
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
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="group">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
