"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Trash, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { DynamicContentEditor } from "@/components/backoffice/DynamicContentEditor";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function PageEditor() {
    const params = useParams();
    const { slug } = params;
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newSectionType, setNewSectionType] = useState("hero");

    const fetchPage = async (isBackgroundUpdate = false) => {
        if (!isBackgroundUpdate) setLoading(true);
        try {
            const res = await fetch(`/api/pages/${slug}`);
            if (res.ok) {
                const data = await res.json();
                setPage(data);
                setSections(data.sections || []);
            } else {
                toast.error("Failed to fetch page");
            }
        } catch (error) {
            console.error("Error fetching page:", error);
            toast.error("Error fetching page");
        } finally {
            if (!isBackgroundUpdate) setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) fetchPage();
    }, [slug]);

    const handleUpdateSection = async (id, content) => {
        try {
            // Validate JSON
            let parsedContent;
            try {
                parsedContent = JSON.parse(content);
            } catch (e) {
                toast.error("Invalid JSON format");
                return;
            }

            const res = await fetch(`/api/sections/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: parsedContent }),
            });

            if (res.ok) {
                toast.success("Section updated successfully");
                fetchPage(true); // Background update to preserve scroll position
            } else {
                toast.error("Failed to update section");
            }
        } catch (error) {
            console.error("Error updating section:", error);
            toast.error("Error updating section");
        }
    };

    const handleDeleteSection = async (id) => {
        if (!confirm("Are you sure you want to delete this section?")) return;
        try {
            const res = await fetch(`/api/sections/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Section deleted successfully");
                fetchPage(true);
            } else {
                toast.error("Failed to delete section");
            }
        } catch (error) {
            console.error("Error deleting section:", error);
            toast.error("Error deleting section");
        }
    };

    const handleAddSection = async () => {
        if (!page) return;
        try {
            const res = await fetch("/api/sections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pageId: page.id,
                    type: newSectionType,
                    content: {}, // Empty content initially
                    order: sections.length + 1,
                }),
            });

            if (res.ok) {
                toast.success("Section added successfully");
                setAddDialogOpen(false);
                fetchPage(true);
            } else {
                toast.error("Failed to add section");
            }
        } catch (error) {
            console.error("Error adding section:", error);
            toast.error("Error adding section");
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!page) return <div className="p-6">Page not found</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Edit Page: {page.title}</h1>
                    <p className="text-gray-500">Slug: {page.slug}</p>
                </div>
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Section
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Section</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <Label>Section Type</Label>
                            <Select value={newSectionType} onValueChange={setNewSectionType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hero">Hero</SelectItem>
                                    <SelectItem value="about">About</SelectItem>
                                    <SelectItem value="services">Services</SelectItem>
                                    <SelectItem value="why-choose-us">Why Choose Us</SelectItem>
                                    <SelectItem value="clients">Clients</SelectItem>
                                    <SelectItem value="technologies">Technologies</SelectItem>
                                    <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddSection}>Add Section</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-6">
                {sections.map((section, index) => (
                    <SectionEditor
                        key={section.id}
                        section={section}
                        onUpdate={handleUpdateSection}
                        onDelete={handleDeleteSection}
                        index={index}
                    />
                ))}
                {sections.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg text-gray-400">
                        No sections found. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}

function SectionEditor({ section, onUpdate, onDelete, index }) {
    const [content, setContent] = useState(section.content);
    const [jsonMode, setJsonMode] = useState(false);
    const [jsonString, setJsonString] = useState(JSON.stringify(section.content, null, 2));
    const [isDirty, setIsDirty] = useState(false);

    // Sync state with prop when section updates (e.g. after save)
    useEffect(() => {
        setContent(section.content);
        // Only update JSON string if we are NOT currently editing it (to avoid cursor jumps or overwrites if we had auto-save)
        // But since we only fetch on explicit save, it's fine to sync.
        // Actually, if we are in JSON mode, we want to reflect the saved content (formatted).
        setJsonString(JSON.stringify(section.content, null, 2));
    }, [section.content]);

    // Sync jsonString when content changes from UI
    useEffect(() => {
        if (!jsonMode) {
            setJsonString(JSON.stringify(content, null, 2));
        }
    }, [content, jsonMode]);

    const handleSave = () => {
        if (jsonMode) {
            try {
                const parsed = JSON.parse(jsonString);
                onUpdate(section.id, JSON.stringify(parsed));
            } catch (e) {
                console.error("JSON Parse Error:", e);
                toast.error(`Invalid JSON: ${e.message}`);
                return;
            }
        } else {
            onUpdate(section.id, JSON.stringify(content));
        }
        setIsDirty(false);
    };

    const handleJsonChange = (e) => {
        setJsonString(e.target.value);
        setIsDirty(true);
    };

    const handleUiChange = (newContent) => {
        setContent(newContent);
        setIsDirty(true);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium uppercase tracking-wide text-muted-foreground">
                        {section.type} Section
                    </CardTitle>
                    <CardDescription>Order: {section.order}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2 mr-4">
                        <Switch
                            id={`mode-${section.id}`}
                            checked={jsonMode}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    // Switching to JSON mode: update string from current content object
                                    setJsonString(JSON.stringify(content, null, 2));
                                } else {
                                    // Switching to UI mode: try to parse current string
                                    try {
                                        setContent(JSON.parse(jsonString));
                                    } catch (e) {
                                        toast.error("Invalid JSON, cannot switch to UI mode");
                                        return; // Cancel switch
                                    }
                                }
                                setJsonMode(checked);
                            }}
                        />
                        <Label htmlFor={`mode-${section.id}`} className="text-xs">JSON Mode</Label>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(section.id)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {jsonMode ? (
                        <div>
                            <Label className="mb-2 block">Content (JSON)</Label>
                            <Textarea
                                value={jsonString}
                                onChange={handleJsonChange}
                                className="font-mono text-sm min-h-[200px]"
                            />
                        </div>
                    ) : (
                        <DynamicContentEditor
                            content={content}
                            onChange={handleUiChange}
                        />
                    )}
                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={!isDirty}>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
