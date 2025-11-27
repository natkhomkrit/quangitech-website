"use client";

import Loading from "@/components/loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal, Trash } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function page() {
  const [users, setUsers] = useState([]);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [sorting, setSorting] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!firstname || !lastname || !username || !email || !password) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: `${firstname} ${lastname}`,
          firstName: firstname,
          lastName: lastname,
          username,
          email,
          password,
          role,
        }),
      });

      if (response.ok) {
        const newUser = await response.json();
        toast.success("User added successfully");

        setUsers((prev) => [...prev, newUser]);

        // Reset form and close dialog
        setFirstname("");
        setLastname("");
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("");
        setAddDialogOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Error adding user:", errorData);
        toast.error(errorData.message || "Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Error adding user", {
        description: error.message,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: `${firstname} ${lastname}`,
          username,
          email,
          password: password || undefined,
        }),
      });

      if (response.ok) {
        toast.success("User updated successfully");

        // Reset state and close dialog
        setEditDialogOpen(false);
        setSelectedUser(null);
        setFirstname("");
        setLastname("");
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");
      toast.success("User deleted successfully");

      // อัปเดต state ลบ user ออกจาก list
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user: ", error);
      toast.error("Error deleting user");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "fullName",
        header: ({ column }) => {
          return (
            <div
              className="flex items-center gap-2 cursor-pointer group select-none"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Full Name
              <ArrowUpDown
                size={14}
                className="invisible group-hover:visible"
              />
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <div>
                <Avatar>
                  {row.original.avatarUrl ? (
                    <AvatarImage
                      src={row.original.avatarUrl}
                      alt={row.original.fullName}
                    />
                  ) : (
                    <AvatarFallback className="bg-blue-200 text-blue-600">
                      {row.original.fullName.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {row.original.fullName}
                </p>
                <p className="text-sm text-gray-500">
                  @{row.original.username}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <div
              className="flex items-center gap-2 cursor-pointer group select-none"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              E-mail
              <ArrowUpDown
                size={14}
                className="invisible group-hover:visible"
              />
            </div>
          );
        },
        cell: ({ row }) => <span>{row.original.email}</span>,
      },
      {
        accessorKey: "isActive",
        header: () => <div className="select-none">Status</div>,
        cell: ({ row }) => (
          <Badge
            className={
              row.original.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          >
            {row.original.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <div
              className="flex items-center gap-2 cursor-pointer group select-none"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Created At
              <ArrowUpDown
                size={14}
                className="invisible group-hover:visible"
              />
            </div>
          );
        },
        cell: ({ row }) => (
          <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return (
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedUser(row.original);
                  const [first, last] = row.original.fullName.split(" ");
                  setFirstname(first || "");
                  setLastname(last || "");
                  setUsername(row.original.username);
                  setEmail(row.original.email);
                  setPassword("");
                  setEditDialogOpen(true);
                }}
              >
                <Edit size={16} /> Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2">
                    <Trash size={16} /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the user.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteUser(row.original.id)}
                    >
                      Confirm
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
    data: users,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });


  return (
    <div className="p-6">
      <div className="flex items-center mb-4 w-full justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage users here.</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>Add User</Button>
      </div>

      <hr />

      <div className="overflow-hidden rounded-md border mt-4">
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
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new user.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={addUser} className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="firstname">First Name *</Label>
                <Input
                  type="text"
                  id="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="lastname">Last Name *</Label>
                <Input
                  type="text"
                  id="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the details of this user.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={updateUser} className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="edit-firstname">First Name *</Label>
                <Input
                  type="text"
                  id="edit-firstname"
                  value={selectedUser?.fullName.split(" ")[0] || ""}
                  onChange={(e) => {
                    if (!selectedUser) return;
                    const names = selectedUser.fullName.split(" ");
                    selectedUser.fullName = `${e.target.value} ${names[1] || ""
                      }`; // update first name
                    setSelectedUser({ ...selectedUser }); // trigger state update
                  }}
                  required
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="edit-lastname">Last Name *</Label>
                <Input
                  type="text"
                  id="edit-lastname"
                  value={selectedUser?.fullName.split(" ")[1] || ""}
                  onChange={(e) => {
                    if (!selectedUser) return;
                    const names = selectedUser.fullName.split(" ");
                    selectedUser.fullName = `${names[0] || ""} ${e.target.value
                      }`; // update last name
                    setSelectedUser({ ...selectedUser }); // trigger state update
                  }}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-username">Username *</Label>
              <Input
                type="text"
                id="edit-username"
                value={selectedUser?.username || ""}
                onChange={(e) => {
                  if (!selectedUser) return;
                  selectedUser.username = e.target.value;
                  setSelectedUser({ ...selectedUser });
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                type="email"
                id="edit-email"
                value={selectedUser?.email || ""}
                onChange={(e) => {
                  if (!selectedUser) return;
                  selectedUser.email = e.target.value;
                  setSelectedUser({ ...selectedUser });
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-password">
                Password (leave blank to keep current)
              </Label>
              <Input
                type="password"
                id="edit-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
