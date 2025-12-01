"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function StatusCards() {
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    published: 0,
    drafts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, categoriesRes, draftsRes, publishedRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/categories"),
          fetch("/api/posts?status=draft"),
          fetch("/api/posts?status=published"),
        ]);

        const users = usersRes.ok ? await usersRes.json() : [];
        const categories = categoriesRes.ok ? await categoriesRes.json() : [];
        const drafts = draftsRes.ok ? await draftsRes.json() : [];
        const published = publishedRes.ok ? await publishedRes.json() : [];

        setStats({
          users: Array.isArray(users) ? users.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
          drafts: Array.isArray(drafts) ? drafts.length : 0,
          published: Array.isArray(published) ? published.length : 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      id: 1,
      label: "Total Users",
      value: stats.users,
    },
    {
      id: 2,
      label: "Total Categories",
      value: stats.categories,
    },
    {
      id: 3,
      label: "Published Posts",
      value: stats.published,
    },
    {
      id: 4,
      label: "Draft Posts",
      value: stats.drafts,
    },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 tracking-wide mb-4">Overview</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg p-4 text-center border border-gray-200 shadow-sm"
          >
            {loading ? (
              <div className="flex justify-center py-2">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-800">{card.value}</div>
                <div className="text-xs text-gray-600 mt-1">{card.label}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
