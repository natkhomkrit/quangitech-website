"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Layout, Loader2 } from "lucide-react";

export default function RecentlyEdited() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const [pagesRes, postsRes] = await Promise.all([
                    fetch("/api/pages"),
                    fetch("/api/posts"),
                ]);

                const pages = pagesRes.ok ? await pagesRes.json() : [];
                const posts = postsRes.ok ? await postsRes.json() : [];

                const combined = [
                    ...pages.map((p) => ({ ...p, type: "page", url: `/backoffice/pages/${p.slug}` })),
                    ...posts.map((p) => ({ ...p, type: "post", url: `/backoffice/posts/${p.slug}/edit` })),
                ];

                // Sort by updatedAt descending
                combined.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

                setItems(combined.slice(0, 5));
            } catch (err) {
                console.error("Error fetching recently edited items:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 tracking-wide mb-4">Recently Edited</h3>
            <div className="space-y-3">
                {loading ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                ) : items.length === 0 ? (
                    <p className="text-gray-500 text-sm">No recent items found</p>
                ) : (
                    items.map((item) => (
                        <Link
                            key={`${item.type}-${item.id}`}
                            href={item.url}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                        >
                            <div className="p-2 rounded-full bg-gray-100 text-gray-600">
                                {item.type === 'page' ? <Layout size={16} /> : <FileText size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                                <p className="text-xs text-gray-500">
                                    {item.type === 'page' ? 'Page' : 'Post'} • {new Date(item.updatedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
