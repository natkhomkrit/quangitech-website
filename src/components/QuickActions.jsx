"use client";

import React from "react";
import Link from "next/link";
import { FilePlus, Menu, UserPlus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuickActions() {
    const actions = [
        {
            id: 1,
            label: "App Post",
            icon: FilePlus,
            href: "/backoffice/posts/create",
        },
        {
            id: 2,
            label: "Add Category",
            icon: Tag,
            href: "/backoffice/categories",
        },
        {
            id: 3,
            label: "Add Menu",
            icon: Menu,
            href: "/backoffice/menus",
        },
        {
            id: 4,
            label: "Add User",
            icon: UserPlus,
            href: "/backoffice/users",
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 tracking-wide mb-4">Urgent action</h3>
            <div className="space-y-2">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Button key={action.id} asChild className="w-full justify-start">
                            <Link href={action.href}>
                                <Icon size={16} className="mr-2" />
                                <span>{action.label}</span>
                            </Link>
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
