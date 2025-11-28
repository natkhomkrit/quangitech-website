"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Edit,
  MoreHorizontal,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "@/components/loading";

export default function PostsTable() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (postSlug) => {
    try {
      // เรียก API เพื่อลบโพสต์
      await fetch(`/api/posts/${postSlug}`, {
        method: "DELETE",
      });

      // ลบโพสต์ออกจาก state
      setPosts((prev) => prev.filter((post) => post.slug !== postSlug));

      // แจ้งเตือนสำเร็จ
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete post");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title{" "}
            <ArrowUpDown size={14} className="invisible group-hover:visible" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-start gap-2">
            {row.original.thumbnail ? (
              <img
                src={row.original.thumbnail}
                alt={row.getValue("title")}
                className="w-32 h-32 object-cover rounded"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                N/A
              </div>
            )}
            <div className="flex flex-col">
              <p className="font-medium">{row.getValue("title")}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "slug",
        header: ({ column }) => (
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Slug{" "}
            <ArrowUpDown size={14} className="invisible group-hover:visible" />
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown size={14} className="invisible group-hover:visible" />
          </div>
        ),
        cell: ({ row }) => {
          const status = row.getValue("status");
          const statusColors = {
            draft: "bg-yellow-100 text-yellow-800",
            published: "bg-green-100 text-green-800",
            archived: "bg-red-100 text-red-800",
          };

          return (
            <Badge
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorFn: (row) => row.author.fullName,
        id: "author",
        header: ({ column }) => (
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Author{" "}
            <ArrowUpDown size={14} className="invisible group-hover:visible" />
          </div>
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <div>
                <Avatar>
                  {row.original.author.avatarUrl ? (
                    <AvatarImage
                      src={row.original.author.avatarUrl}
                      alt={row.original.author.fullName}
                    />
                  ) : (
                    <AvatarFallback className="bg-blue-200 text-blue-600">
                      {row.original.author.fullName.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {row.original.author.fullName}
                </p>
                <p className="text-sm text-gray-500">
                  @{row.original.author.username}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorFn: (row) => (row.isFeatured ? "Yes" : "No"),
        id: "featured",
        header: ({ column }) => (
          <div className="flex items-center cursor-pointer">Featured</div>
        ),
        cell: ({ row }) => {
          const isFeatured = row.getValue("featured");
          const badgeColors = {
            Yes: "bg-green-100 text-green-800",
            No: "bg-gray-100 text-gray-800",
          };

          return (
            <div className="flex justify-center">
              <Badge
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColors[isFeatured] || "bg-gray-100 text-gray-800"
                  }`}
              >
                {isFeatured}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorFn: (row) => {
          if (!row.publishedAt) return null;
          const d = new Date(row.publishedAt);
          const pad = (n) => n.toString().padStart(2, "0");
          return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
            d.getDate()
          )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
            d.getSeconds()
          )}`;
        },
        id: "publishedAt",
        header: ({ column }) => (
          <div
            className="flex items-center justify-center gap-2 cursor-pointer group"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Published At
            <ArrowUpDown size={14} className="invisible group-hover:visible" />
          </div>
        ),
        cell: ({ row }) => {
          const value = row.getValue("publishedAt");
          return <div className="text-center">{value ?? "-"}</div>;
        },
      },
      {
        accessorFn: (row) => {
          const d = new Date(row.createdAt);
          const pad = (n) => n.toString().padStart(2, "0");
          return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
            d.getDate()
          )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
            d.getSeconds()
          )}`;
        },
        id: "createdAt",
        header: ({ column }) => (
          <div
            className="flex items-center justify-center gap-2 cursor-pointer group"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At{" "}
            <ArrowUpDown size={14} className="invisible group-hover:visible" />
          </div>
        ),
        cell: ({ row }) => {
          return <div className="text-center">{row.getValue("createdAt")}</div>;
        },
      },
      {
        id: "actions",
        enableHiding: false,
        header: "Actions",
        cell: ({ row }) => {
          const post = row.original;
          return (
            <div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/backoffice/posts/${post.slug}/edit`}>
                  <Edit size={16} /> Edit
                </Link>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2">
                    <Trash size={16} /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <p>This action cannot be undone.</p>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => handleDelete(post.slug)}
                    >
                      Yes, delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: posts,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Posts</h1>
          <p className="text-sm text-muted-foreground">
            Manage your posts here.
          </p>
        </div>
        <Link href="/backoffice/posts/create">
          <Button>Add New Post</Button>
        </Link>
      </div>
      <hr />
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by title..."
          value={table.getColumn("title")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-x-auto rounded-md border">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
