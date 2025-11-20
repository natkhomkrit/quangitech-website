"use client";

import React, { useState, useEffect } from "react";

export default function StatusCards() {
  const [stats, setStats] = useState({
    drafts: 0,
    published: 0,
    menuItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const draftRes = await fetch("/api/posts?status=draft");
        const draftData = draftRes.ok ? await draftRes.json() : [];

        const pubRes = await fetch("/api/posts?status=published");
        const pubData = pubRes.ok ? await pubRes.json() : [];

        const menusRes = await fetch("/api/posts?isFeatured=true");
        const menuItems = menusRes.ok ? await menusRes.json() : [];

        setStats({
          drafts: Array.isArray(draftData) ? draftData.length : 0,
          published: Array.isArray(pubData) ? pubData.length : 0,
          menuItems: Array.isArray(menuItems) ? menuItems.length : 0,
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
      label: "Draft",
      value: stats.drafts,
    },
    {
      id: 2,
      label: "Published",
      value: stats.published,
    },
    {
      id: 3,
      label: "Featured",
      value: stats.menuItems,
    },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 tracking-wide mb-4">Status</h3>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg p-3 text-center border border-gray-200 shadow-sm min-w-[110px]"
          >
            {loading ? (
              <div className="text-lg font-light text-gray-400">...</div>
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
