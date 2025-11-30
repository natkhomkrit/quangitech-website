"use client";

import { useState, useMemo } from "react";
import * as FaIcons from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Search, X } from "lucide-react";

export function IconPicker({ value, onChange, label = "Icon" }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    // Get all valid icon names from FontAwesome (react-icons/fa)
    const iconList = useMemo(() => {
        return Object.keys(FaIcons)
            .filter((key) => key.startsWith("Fa")) // Ensure we only get icons
            .sort();
    }, []);

    const filteredIcons = useMemo(() => {
        if (!search) return iconList.slice(0, 100); // Show first 100 by default
        return iconList.filter((name) =>
            name.toLowerCase().includes(search.toLowerCase())
        ).slice(0, 100); // Limit results for performance
    }, [search, iconList]);

    const SelectedIcon = value && FaIcons[value] ? FaIcons[value] : null;

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex items-center gap-4">
                {SelectedIcon ? (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                        <SelectedIcon className="h-6 w-6" />
                        <span className="text-sm font-medium">{value}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-2"
                            onClick={() => onChange("")}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <div className="text-sm text-gray-500 italic">No icon selected</div>
                )}

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            {value ? "Change Icon" : "Select Icon"}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Select an Icon (FontAwesome)</DialogTitle>
                        </DialogHeader>
                        <div className="relative mb-4">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search icons (e.g. FaHome)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 overflow-y-auto p-2 flex-1">
                            {filteredIcons.map((iconName) => {
                                const Icon = FaIcons[iconName];
                                return (
                                    <button
                                        key={iconName}
                                        className={`p-2 rounded-md flex flex-col items-center justify-center gap-1 hover:bg-gray-100 transition-colors ${value === iconName ? "bg-primary/10 ring-2 ring-primary" : ""
                                            }`}
                                        onClick={() => {
                                            onChange(iconName);
                                            setOpen(false);
                                        }}
                                        title={iconName}
                                    >
                                        <Icon className="h-6 w-6" />
                                    </button>
                                );
                            })}
                            {filteredIcons.length === 0 && (
                                <div className="col-span-full text-center py-8 text-gray-500">
                                    No icons found
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
