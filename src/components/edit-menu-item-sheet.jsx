"use client";

import React, { useState, useEffect } from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

export default function EditMenuItemSheet({ item, open, onOpenChange, onUpdate }) {
    const [formData, setFormData] = useState({ name: "", url: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (item) {
            setFormData({ name: item.name || "", url: item.url || "" });
        }
    }, [item]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/menu-items/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    url: formData.url,
                }),
            });

            if (!res.ok) throw new Error("Failed to update menu item");

            const updatedItem = await res.json();
            onUpdate(updatedItem);
            onOpenChange(false);
            toast.success("Menu item updated");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update menu item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit Menu Item</SheetTitle>
                    <SheetDescription>
                        Make changes to your menu item here. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 px-4 mt-4">
                    {/* Name */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Menu item name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* URL */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            placeholder="/example"
                            value={formData.url}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <SheetFooter className="flex flex-row gap-2 mt-4">
                    <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                        {loading ? "Saving..." : "Save changes"}
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline" className="flex-1">
                            Close
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
