"use client";

import React, { useState, useEffect } from "react";
import { FileText, Trash, User, Menu as MenuIcon, Link as LinkIcon } from "lucide-react";

function formatTimeAgo(date) {
  if (!date) return "unknown time";
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

/** เช็คว่าเป็น created หรือ edited */
function getAction(createdAt, updatedAt) {
  if (!createdAt && updatedAt) return "updated";
  if (!updatedAt) return "created";

  const c = new Date(createdAt);
  const u = new Date(updatedAt);

  if (c.getTime() === u.getTime()) return "created";
  if (u > c) return "edited";

  return "updated";
}

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("/api/activities?limit=10");
        const data = res.ok ? await res.json() : [];

        const activityList = [];

        // fetch menus so we can classify menu items (Navbar vs Footer)
        let menuMap = {};
        try {
          const menusRes = await fetch("/api/menus");
          const menusData = menusRes.ok ? await menusRes.json() : [];
          if (Array.isArray(menusData)) {
            menusData.forEach((m) => {
              const key = m.id ?? m._id ?? (m._id && m._id.toString && m._id.toString()) ?? m.menuId ?? null;
              if (key) menuMap[String(key)] = m;
            });
          }
        } catch (e) {
          // ignore menu fetch errors; fallback to metadata inference
          menuMap = {};
        }

        if (Array.isArray(data)) {
          data.slice(0, 10).forEach((act) => {
            // choose icon by type, but show Trash when deleted
            let Icon;
            if ((act.action || "").toLowerCase() === "deleted") {
              Icon = Trash;
            } else {
              const t = (act.type || "").toLowerCase();
              if (t === "user") Icon = User;
              else if (t === "menu") Icon = MenuIcon;
              else if (t === "menuitem" || t === "menu-item" || t === "menu_item") Icon = LinkIcon;
              else Icon = FileText; // default for posts/others
            }

            const actorName = act.user ? (act.user.fullName || act.user.username) : null;
            const actorAvatar = act.user ? act.user.avatarUrl || null : null;

            // Determine menu label (if this is a menu item) by checking metadata.menuId and menus map
            let menuLabel = null;
            try {
              const t = (act.type || "").toLowerCase();
              const maybeMenuId = act.metadata?.menuId ?? act.metadata?.menu_id ?? act.metadata?.menu ?? null;
              if (t === "menuitem" || t === "menu-item" || t === "menu_item" || maybeMenuId) {
                const mid = maybeMenuId ? String(maybeMenuId) : null;
                if (mid && menuMap[mid]) {
                  menuLabel = menuMap[mid].name ?? menuMap[mid].title ?? menuMap[mid].label ?? null;
                }
              }
            } catch (e) {
              menuLabel = null;
            }

            // map action to color classes
            const action = (act.action || "updated").toLowerCase();
            const actionMap = {
              created: {
                iconClass: "text-green-600",
                badgeBg: "bg-green-50",
                badgeText: "text-green-700",
              },
              edited: {
                iconClass: "text-yellow-600",
                badgeBg: "bg-yellow-50",
                badgeText: "text-yellow-700",
              },
              deleted: {
                iconClass: "text-red-600",
                badgeBg: "bg-red-50",
                badgeText: "text-red-700",
              },
              updated: {
                iconClass: "text-gray-600",
                badgeBg: "bg-gray-50",
                badgeText: "text-gray-600",
              },
            };

            const actionStyles = actionMap[action] || actionMap.updated;

            activityList.push({
              id: `activity-${act.id}`,
              type: act.type || "post",
              title: act.title || "(no title)",
              action,
              timestamp: act.createdAt,
              icon: Icon,
              iconClass: actionStyles.iconClass,
              badgeBg: actionStyles.badgeBg,
              badgeText: actionStyles.badgeText,
              actorName,
              actorAvatar,
              metadata: act.metadata || null,
              menuLabel,
            });
          });
        }

        /** Sort newest first */
        activityList.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setActivities(activityList.slice(0, 10));
      } catch (err) {
        console.error("Error fetching activities:", err);

        // fallback mock
        setActivities([
          {
            id: "1",
            type: "post",
            title: "System Dev Project",
            action: "created",
            timestamp: new Date(Date.now() - 60 * 60000),
            icon: FileText,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 tracking-wide mb-4">
        Latest activity
      </h3>

      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : activities.length === 0 ? (
          <p className="text-gray-500 text-sm">No activities yet</p>
        ) : (
          activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex gap-3 pb-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Icon size={16} className="text-gray-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">
                    <span className="font-medium">
                      {(() => {
                        const t = (activity.type || "").toLowerCase();
                        // prefer menuLabel if available for menu items
                        if (activity.menuLabel) {
                          const nm = (activity.menuLabel || "").toLowerCase();
                          if (nm.includes("footer")) return "[Footer]";
                          if (nm.includes("nav") || nm.includes("navigation") || nm.includes("header") || nm.includes("menu")) return "[Navbar]";
                          return `[${activity.menuLabel}]`;
                        }

                        if (t === "user") return "[User]";
                        if (t === "post") return "[Post]";
                        if (t === "menu") return "[Menu]";
                        if (t === "menuitem" || t === "menu-item" || t === "menu_item") return "[Menu Item]";
                        // fallback: infer from metadata
                        if (activity.metadata) {
                          try {
                            if (activity.metadata.menuId && activity.metadata.id) return "[Menu Item]";
                            if (activity.metadata.id && !activity.metadata.menuId) return "[Menu]";
                          } catch (e) {}
                        }
                        // default
                        return `[${(activity.type || "Post").charAt(0).toUpperCase() + (activity.type || "Post").slice(1)}]`;
                      })()}
                    </span>
                    {" "}
                    {activity.title}
                  </p>

                  <p className="text-xs mt-1 flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${activity.badgeBg} ${activity.badgeText}`}>
                      {activity.action}
                    </span>
                    {activity.actorName ? (
                      <span className="ml-2 text-xs text-gray-400 flex items-center gap-2">
                        {activity.actorAvatar ? (
                          <img src={activity.actorAvatar} alt={activity.actorName} className="w-4 h-4 rounded-full" />
                        ) : null}
                        <span>by {activity.actorName}</span>
                      </span>
                    ) : null}
                  </p>
                </div>

                <div className="flex-shrink-0 text-xs text-gray-400 whitespace-nowrap">
                  {formatTimeAgo(activity.timestamp)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
