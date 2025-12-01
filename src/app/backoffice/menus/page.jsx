"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CopyPlus,
  Trash,
  ChevronDown,
  GripVertical,
  Copy,
  Plus,
  Pencil,
  Loader2,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddMenuItemSheet from "@/components/add-menu-item-sheet";
import EditMenuItemSheet from "@/components/edit-menu-item-sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Loading from "@/components/loading";
import { Dialog } from "@/components/ui/dialog";
import AddSubmenuSheet from "@/components/add-submenu-sheet";

function SortableItem({ id, children, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: dndKitIsDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    opacity: dndKitIsDragging ? 0.5 : 1,
    zIndex: dndKitIsDragging ? 50 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {React.cloneElement(children, {
        dragHandleProps: { ...attributes, ...listeners },
        isDragging: dndKitIsDragging,
      })}
    </div>
  );
}

function MenuItemCard({
  item,
  isDragging,
  dragHandleProps,
  isChild,
  onDelete,
  onAddSubmenu,
  onEdit,
  menuId,
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(item);
  };

  const handleConfirmDelete = () => {
    onDelete(item.id, menuId);
    setShowDeleteDialog(false);
  };

  const handleCopyUrl = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`http://localhost:3000${item.url}`);
  };

  const handleAddSubmenu = (e) => {
    e.stopPropagation();
    onAddSubmenu(item.id);
  };

  return (
    <>
      <Card
        className={`
        shadow-none border transition-all duration-150 ease-in-out
        ${isDragging ? "bg-accent shadow-lg" : "hover:shadow-sm"}
        ${isChild ? "border-l-2 border-l-blue-200" : ""}
      `}
      >
        <CardContent className="py-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 justify-between">
            <div className="flex items-center w-full sm:w-auto overflow-hidden">
              {/* Drag handle */}
              {!isChild && (
                <div
                  {...dragHandleProps}
                  className="
                    cursor-grab active:cursor-grabbing 
                    p-2 hover:bg-muted rounded-md mr-2
                    transition-colors duration-150
                    touch-none select-none
                    flex-shrink-0
                  "
                  title="Drag to reorder"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
              )}

              <div className="flex-1 flex flex-col min-w-0 mr-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold truncate">{item.name}</span>
                  {item.children && item.children.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap">
                      {item.children.length} submenu
                      {item.children.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 w-fit group cursor-pointer transition-all">
                  <span
                    onClick={handleCopyUrl}
                    className="truncate max-w-[200px] sm:max-w-xs text-muted-foreground"
                  >
                    {`http://localhost:3000${item.url}`}
                  </span>
                  <Copy
                    size={16}
                    className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-gray-500 hover:text-gray-700 flex-shrink-0"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {!isDragging && (
              <div className="flex gap-2 self-end sm:self-auto ml-0 sm:ml-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleEditClick}
                  className="h-8 w-8"
                  title="Edit item"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                {/* Add submenu button - only for parent items */}
                {!isChild && (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleAddSubmenu}
                    className="h-8 w-8"
                    title="Add submenu item"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleDeleteClick}
                  className="h-8 w-8"
                  title="Delete item"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              menu item "{item.name}"
              {item.children &&
                item.children.length > 0 &&
                ` and all its ${item.children.length} submenu item(s)`}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function RenderMenuItem({
  item,
  draggingItemId,
  dragHandleProps,
  isChild = false,
  onDelete,
  onAddSubmenu,
  onEdit,
  menuId,
  parentIsDragging = false,
}) {
  const isDragging = draggingItemId === item.id.toString();
  const shouldHighlight = isDragging || parentIsDragging;

  return (
    <div className="space-y-1">
      <MenuItemCard
        item={item}
        isDragging={shouldHighlight}
        dragHandleProps={isChild ? undefined : dragHandleProps}
        isChild={isChild}
        onDelete={onDelete}
        onAddSubmenu={onAddSubmenu}
        onEdit={onEdit}
        menuId={menuId}
      />
      {item.children && item.children.length > 0 && (
        <div
          className={`
          ml-6 space-y-1 transition-all duration-200 border-l-2 border-l-gray-200 pl-4
          ${isDragging ? "opacity-50" : "opacity-100"}
        `}
        >
          {item.children
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((child) => (
              <RenderMenuItem
                key={child.id}
                item={child}
                draggingItemId={draggingItemId}
                isChild={true}
                onDelete={onDelete}
                onAddSubmenu={onAddSubmenu}
                onEdit={onEdit}
                menuId={menuId}
                parentIsDragging={isDragging}
              />
            ))}
        </div>
      )}
    </div>
  );
}





export default function Menus() {
  const [menus, setMenus] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [draggingItemId, setDraggingItemId] = useState(null);
  const [draggingItem, setDraggingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submenuSheet, setSubmenuSheet] = useState({
    open: false,
    parentItem: null,
    menu: null,
  });
  const [editSheet, setEditSheet] = useState({ open: false, item: null });

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/menus");
        if (!res.ok) throw new Error("Failed to fetch menus");
        const data = await res.json();
        setMenus(data);
      } catch (error) {
        console.error("Error fetching menus:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const handleDeleteMenuItem = async (itemId, menuId) => {
    try {
      const res = await fetch(`/api/menu-items/${itemId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.details || errData.error || "Failed to delete menu item");
      }

      setMenus((prevMenus) =>
        prevMenus.map((menu) => {
          if (menu.id !== menuId) return menu;
          const removeItem = (items) =>
            items
              .filter((item) => item.id !== itemId)
              .map((item) => ({
                ...item,
                children: item.children ? removeItem(item.children) : undefined,
              }));
          return { ...menu, items: removeItem(menu.items) };
        })
      );
      toast.success("Menu item deleted.");
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const handleAddSubmenu = (parentId) => {
    // Find the parent item and menu
    let parentItem = null;
    let parentMenu = null;

    for (const menu of menus) {
      parentItem = menu.items.find((item) => item.id === parentId);
      if (parentItem) {
        parentMenu = menu;
        break;
      }
    }

    if (parentItem && parentMenu) {
      setSubmenuSheet({
        open: true,
        parentItem,
        menu: parentMenu,
      });
    }
  };

  const handleSubmenuAdded = (newSubmenuItem) => {
    setMenus((prevMenus) =>
      prevMenus.map((menu) => {
        if (menu.id !== submenuSheet.menu.id) return menu;

        const updateItems = (items) =>
          items.map((item) => {
            if (item.id === submenuSheet.parentItem.id) {
              return {
                ...item,
                children: [...(item.children || []), newSubmenuItem].sort(
                  (a, b) => a.sortOrder - b.sortOrder
                ),
              };
            }
            return {
              ...item,
              children: item.children
                ? updateItems(item.children)
                : item.children,
            };
          });

        return { ...menu, items: updateItems(menu.items) };
      })
    );
    toast.success("Submenu item added!");
  };

  const handleEditItem = (item) => {
    setEditSheet({ open: true, item });
  };

  const handleItemUpdated = (updatedItem) => {
    setMenus((prevMenus) =>
      prevMenus.map((menu) => {
        // Helper to recursively update item
        const updateItems = (items) =>
          items.map((item) => {
            if (item.id === updatedItem.id) {
              return { ...item, ...updatedItem, children: item.children }; // Preserve children
            }
            if (item.children) {
              return { ...item, children: updateItems(item.children) };
            }
            return item;
          });

        return { ...menu, items: updateItems(menu.items) };
      })
    );
  };

  const handleToggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);

  const handleDragStart = (event) => {
    const draggedId = event.active.id.toString();
    setDraggingItemId(draggedId);

    let draggedItem = null;
    for (const menu of menus) {
      draggedItem = menu.items.find((item) => item.id.toString() === draggedId);
      if (draggedItem) break;
    }
    setDraggingItem(draggedItem);
  };

  const handleDragEnd = async (event, menuId) => {
    const { active, over } = event;
    setDraggingItemId(null);
    setDraggingItem(null);

    if (!over || active.id === over.id) return;

    setMenus((prev) =>
      prev.map((menu) => {
        if (menu.id !== menuId) return menu;

        const oldIndex = menu.items.findIndex(
          (m) => m.id.toString() === active.id
        );
        const newIndex = menu.items.findIndex(
          (m) => m.id.toString() === over.id
        );

        const reordered = arrayMove(menu.items, oldIndex, newIndex).map(
          (m, idx) => ({ ...m, sortOrder: idx + 1 })
        );

        reordered.forEach(async (item) => {
          try {
            await fetch(`/api/menu-items/${item.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sortOrder: item.sortOrder }),
            });
          } catch (error) {
            console.error("Failed to update menu item:", error);
          }
        });

        return { ...menu, items: reordered };
      })
    );
  };


  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Menus</h1>
          <p className="text-sm text-muted-foreground">
            Manage your menus and submenus
          </p>
        </div>
      </div>

      <div className="border-l-4 border-l-white flex pb-3 px-2 border-b text-sm font-medium text-muted-foreground">
        <div className="flex-1">Name</div>
        <div className="w-36 text-center">Items</div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-gray-500" size={32} />
        </div>
      ) : (
        menus.map((menu) => (
          <div key={menu.id}>
            <div
              className={`py-3 px-2 flex items-center border-l-4 border-y cursor-pointer transition-all duration-200 ${openMenuId === menu.id
                ? "border-l-primary bg-muted/20"
                : "border-l-white hover:border-l-primary hover:bg-muted/30"
                }`}
              onClick={() => handleToggleMenu(menu.id)}
            >
              <div className="flex-1 font-medium">{menu.name}</div>
              <div className="w-36 text-center text-muted-foreground">
                {menu.items.reduce(
                  (total, item) =>
                    total + 1 + (item.children ? item.children.length : 0),
                  0
                )}
              </div>
              <ChevronDown
                className={`h-4 w-4 ml-2 transition-transform duration-200 ${openMenuId === menu.id ? "rotate-180" : ""
                  }`}
              />
            </div>

            {openMenuId === menu.id && (
              <div className="pl-6 my-4 space-y-2">
                <AddMenuItemSheet
                  menu={menu}
                  onAdd={(newItem) => {
                    setMenus((prev) =>
                      prev.map((m) =>
                        m.id === menu.id
                          ? { ...m, items: [...m.items, newItem] }
                          : m
                      )
                    );
                    toast.success("Menu item added!");
                  }}
                />

                <DndContext
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={(e) => handleDragEnd(e, menu.id)}
                >
                  <SortableContext
                    items={menu.items.map((item) => item.id.toString())}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {menu.items
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((item) => (
                          <SortableItem
                            key={item.id}
                            id={item.id.toString()}
                            isDragging={draggingItemId === item.id.toString()}
                          >
                            <RenderMenuItem
                              item={item}
                              draggingItemId={draggingItemId}
                              onDelete={handleDeleteMenuItem}
                              onAddSubmenu={handleAddSubmenu}
                              onEdit={handleEditItem}
                              menuId={menu.id}
                            />
                          </SortableItem>
                        ))}
                    </div>
                  </SortableContext>

                  <DragOverlay>
                    {draggingItem && (
                      <div>
                        <MenuItemCard
                          item={draggingItem}
                          isDragging={false}
                          isChild={false}
                          onDelete={() => { }}
                          onAddSubmenu={() => { }}
                          onEdit={() => { }}
                          menuId={menu.id}
                        />
                      </div>
                    )}
                  </DragOverlay>
                </DndContext>
              </div>
            )}
          </div>
        ))
      )}

      {/* Submenu Sheet */}
      <AddSubmenuSheet
        parentItem={submenuSheet.parentItem}
        menu={submenuSheet.menu}
        onAdd={handleSubmenuAdded}
        open={submenuSheet.open}
        onOpenChange={(open) => setSubmenuSheet({ ...submenuSheet, open })}
      />

      {/* Edit Item Sheet */}
      <EditMenuItemSheet
        item={editSheet.item}
        open={editSheet.open}
        onOpenChange={(open) => setEditSheet({ ...editSheet, open })}
        onUpdate={handleItemUpdated}
      />
    </div>
  );
}
