"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Trash, Plus, GripVertical, Search, Loader2, ArrowLeft } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function SortableItem({ id, children }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : "auto",
        position: "relative",
    };

    return (
        <div ref={setNodeRef} style={style}>
            {React.cloneElement(children, {
                dragHandleProps: { ...attributes, ...listeners },
                isDragging,
            })}
        </div>
    );
}

export default function PageEditor() {
    const params = useParams();
    const { slug } = params;
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState([]);
    const [shouldScroll, setShouldScroll] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const bottomRef = useRef(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

    useEffect(() => {
        if (shouldScroll && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
            setShouldScroll(false);
        }
    }, [sections, shouldScroll]);

    const filteredSections = sections.filter(section => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const type = section.type?.toLowerCase() || "";
        const title = section.content?.title?.toLowerCase() || "";
        const subtitle = section.content?.subtitle?.toLowerCase() || "";
        return type.includes(query) || title.includes(query) || subtitle.includes(query);
    });

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

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };
    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (active.id !== over.id) {
            const oldIndex = sections.findIndex((item) => item.id === active.id);
            const newIndex = sections.findIndex((item) => item.id === over.id);

            const reorderedSections = arrayMove(sections, oldIndex, newIndex);

            // Update the order property for all sections to match their new index
            const newSections = reorderedSections.map((section, index) => ({
                ...section,
                order: index + 1
            }));

            // Optimistic update
            setSections(newSections);

            // Update orders in backend
            try {
                const updates = newSections.map((section) =>
                    fetch(`/api/sections/${section.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ order: section.order }),
                    })
                );
                await Promise.all(updates);
                toast.success("Section order updated");
            } catch (error) {
                console.error("Error updating order:", error);
                toast.error("Failed to update section order");
                fetchPage(true); // Revert to server state
            }
        }
    };

    const handleAddSection = async (variant = "default") => {
        if (!page) return;
        try {
            let type = "generic";
            let defaultContent = {};

            if (page.slug === "executives") {
                type = "executive";
                if (variant === "quote") {
                    defaultContent = {
                        subtitle: "Inspiration",
                        quote: "Quote goes here..."
                    };
                } else {
                    defaultContent = {
                        subtitle: "Leadership",
                        image: "",
                        imageWidth: "320px",
                        imageHeight: "320px",
                        name: "Name Surname",
                        position: "Position",
                        company: "Company Name",
                        quote: "Quote goes here..."
                    };
                }
            } else if (page.slug === "contact") {
                type = "contact";
                defaultContent = {
                    logo: "",
                    logoWidth: "144px",
                    companyName: "",
                    address: "",
                    phone: "",
                    email: "",
                    recipientEmail: "",
                    mapUrl: "",
                    formTitle: "",
                    formDescription: ""
                };
            } else if (page.slug === "footer") {
                type = "footer";
                defaultContent = {
                    logo: "",
                    logoWidth: "140px",
                    description: "",
                    address: "",
                    phone: "",
                    email: "",
                    facebookUrl: "",
                    copyright: ""
                };
            } else if (page.slug === "company") {
                type = "company";
                defaultContent = {
                    subtitle: "About Us",
                    title: "Our Company",
                    content: "<p>Company description...</p>"
                };
            } else if (page.slug === "home") {
                type = variant === "default" ? "generic" : variant;

                if (type === "hero") {
                    defaultContent = {
                        title: "Empowering Your Digital Future",
                        description: "We provide cutting-edge solutions for your business needs.",
                        buttonText: "Get Started",
                        buttonLink: "/contact"
                    };
                } else if (type === "about") {
                    defaultContent = {
                        title: "About Us",
                        subtitle: "Who We Are",
                        description: "We are a team of passionate developers.",
                        image: "",
                        imageWidth: "500px",
                        imageHeight: "auto",
                        imageMaxWidth: "100%",
                        features: [
                            { title: "Feature 1", text: "Description 1", icon: "" }
                        ]
                    };
                } else if (type === "services") {
                    defaultContent = {
                        title: "Our Services",
                        description: "Comprehensive IT solutions for your business."
                    };
                } else if (type === "recent-works") {
                    defaultContent = {
                        title: "Recent Works",
                        description: "Check out our latest projects.",
                        buttonText: "View All Projects",
                        buttonLink: "/portfolio"
                    };
                } else if (type === "news-events") {
                    defaultContent = {
                        title: "News & Events",
                        description: "Stay updated with our latest news.",
                        buttonText: "View All News",
                        buttonLink: "/news"
                    };
                } else if (type === "why-choose-us") {
                    defaultContent = {
                        title: "Why Choose Us",
                        subtitle: "Our Advantages",
                        description: "Reasons to partner with us.",
                        image: "",
                        imageWidth: "600px",
                        imageHeight: "450px",
                        imageMaxWidth: "100%",
                        features: [
                            { title: "Expert Team", description: "Highly skilled professionals.", icon: "users" },
                            { title: "Quality Assurance", description: "We ensure top-notch quality.", icon: "check-circle" },
                            { title: "24/7 Support", description: "Always here to help you.", icon: "headset" }
                        ]
                    };
                } else if (type === "call-to-action") {
                    defaultContent = {
                        title: "Ready to Start?",
                        description: "Contact us today to discuss your project.",
                        buttonText: "Contact Us",
                        buttonLink: "/contact"
                    };
                } else if (type === "clients") {
                    defaultContent = {
                        title: "Our Clients",
                        images: [
                            ""
                        ],
                        imageWidth: "120px",
                        imageHeight: "60px",
                        imageMaxWidth: "100%"
                    };
                } else {
                    // Default generic
                    type = "generic";
                    defaultContent = {
                        subtitle: "Subtitle",
                        title: `Section ${sections.length + 1}`,
                        content: "<p>Content goes here...</p>"
                    };
                }
            } else {
                type = "generic";
                defaultContent = {
                    subtitle: "Subtitle",
                    title: `Section ${sections.length + 1}`,
                    content: "<p>Content goes here...</p>"
                };
            }

            const res = await fetch("/api/sections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pageId: page.id,
                    type: type,
                    content: defaultContent,
                    order: sections.length + 1
                }),
            });

            if (res.ok) {
                toast.success("Section created successfully");
                await fetchPage(true);
                setShouldScroll(true);
            } else {
                toast.error("Failed to create section");
            }
        } catch (error) {
            console.error("Error creating section:", error);
            toast.error("Error creating section");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }
    if (!page) return <div className="p-6">Page not found</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex flex-col gap-6 mb-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/backoffice/pages">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Edit Page: {page.title}</h1>
                            <p className="text-gray-500">Slug: {page.slug}</p>
                        </div>
                    </div>
                    {page.slug === "executives" ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> Add Section
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleAddSection("default")}>
                                    Executive Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAddSection("quote")}>
                                    Executive Quote
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : page.slug === "home" ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> Add Section
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-h-[400px] overflow-y-auto">
                                <DropdownMenuItem onClick={() => handleAddSection("hero")}>Hero Section</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAddSection("about")}>About Us</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAddSection("services")}>Services</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAddSection("recent-works")}>Recent Works</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAddSection("news-events")}>News & Events</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAddSection("why-choose-us")}>Why Choose Us</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAddSection("call-to-action")}>Call To Action</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAddSection("clients")}>Clients</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button onClick={() => handleAddSection("default")}>
                            <Plus className="mr-2 h-4 w-4" /> Add Section
                        </Button>
                    )}
                </div>

                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Filter sections by type, title, or subtitle..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-6">
                {searchQuery ? (
                    <div className="space-y-6">
                        {filteredSections.map((section, index) => (
                            <SectionEditor
                                key={section.id}
                                section={section}
                                onUpdate={handleUpdateSection}
                                onDelete={handleDeleteSection}
                                index={index}
                                isDragDisabled={true}
                            />
                        ))}
                        {filteredSections.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed rounded-lg text-gray-400">
                                No sections match your search.
                            </div>
                        )}
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={sections.map(s => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {sections.map((section, index) => (
                                <SortableItem key={section.id} id={section.id}>
                                    <SectionEditor
                                        section={section}
                                        onUpdate={handleUpdateSection}
                                        onDelete={handleDeleteSection}
                                        index={index}
                                    />
                                </SortableItem>
                            ))}
                        </SortableContext>
                        <DragOverlay>
                            {activeId ? (
                                <SectionEditor
                                    section={sections.find(s => s.id === activeId)}
                                    onUpdate={() => { }}
                                    onDelete={() => { }}
                                    index={sections.findIndex(s => s.id === activeId)}
                                    isOverlay
                                />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                )}

                {!searchQuery && sections.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg text-gray-400">
                        No sections found. Add one to get started.
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}

function SectionEditor({ section, onUpdate, onDelete, index, dragHandleProps, isOverlay, isDragDisabled }) {
    const [content, setContent] = useState(section.content);
    const [jsonMode, setJsonMode] = useState(false);
    const [jsonString, setJsonString] = useState(JSON.stringify(section.content, null, 2));
    const [isDirty, setIsDirty] = useState(false);

    // Sync state with prop when section updates (e.g. after save)
    useEffect(() => {
        setContent(section.content);
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
        <Card className={isOverlay ? "opacity-80 shadow-xl cursor-grabbing" : ""}>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 pb-2">
                <div className="flex items-center gap-3">
                    {!isDragDisabled && (
                        <div
                            {...dragHandleProps}
                            className="cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded-md touch-none flex-shrink-0"
                            title="Drag to reorder"
                        >
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </div>
                    )}
                    <div className="space-y-1">
                        <CardTitle className="text-base font-medium uppercase tracking-wide text-muted-foreground">
                            {section.type} Section
                        </CardTitle>
                        <CardDescription>Order: {section.order}</CardDescription>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                    {!['hero', 'about', 'services', 'recent-works', 'news-events', 'why-choose-us', 'call-to-action', 'clients', 'generic', 'executive', 'contact', 'footer', 'company'].includes(section.type?.toLowerCase()) && (
                        <div className="flex items-center space-x-2 mr-4">
                            <Switch
                                id={`mode-${section.id}`}
                                checked={jsonMode}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setJsonString(JSON.stringify(content, null, 2));
                                    } else {
                                        try {
                                            setContent(JSON.parse(jsonString));
                                        } catch (e) {
                                            toast.error("Invalid JSON, cannot switch to UI mode");
                                            return;
                                        }
                                    }
                                    setJsonMode(checked);
                                }}
                            />
                            <Label htmlFor={`mode-${section.id}`} className="text-xs">JSON Mode</Label>
                        </div>
                    )}
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
                            uniqueId={section.id}
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
