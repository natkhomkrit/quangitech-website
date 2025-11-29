"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Edit, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PagesManagement() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newSlug, setNewSlug] = useState("");

    const fetchPages = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/pages");
            if (res.ok) {
                const data = await res.json();
                setPages(data);
            }
        } catch (error) {
            console.error("Error fetching pages:", error);
            toast.error("Failed to fetch pages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleCreatePage = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/pages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle, slug: newSlug }),
            });

            if (res.ok) {
                toast.success("Page created successfully");
                setCreateDialogOpen(false);
                setNewTitle("");
                setNewSlug("");
                fetchPages();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to create page");
            }
        } catch (error) {
            console.error("Error creating page:", error);
            toast.error("Failed to create page");
        }
    };

    const seedHomePage = async () => {
        // Check if home page exists
        const homePage = pages.find((p) => p.slug === "home");
        if (homePage) {
            toast.error("Home page already exists");
            return;
        }

        try {
            // Create Home Page
            const pageRes = await fetch("/api/pages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Home Page", slug: "home" }),
            });

            if (!pageRes.ok) throw new Error("Failed to create home page");
            const page = await pageRes.json();

            // Create Sections
            const sections = [
                {
                    type: "hero",
                    order: 1,
                    content: {
                        title: "Digital & IT Solutions",
                        subtitle: "Partner for Your Growth",
                        description: "เราเป็นพันธมิตรด้านดิจิทัลและไอที ที่พร้อมวางแผน พัฒนา และดูแลระบบครบวงจร เพื่อช่วยขับเคลื่อนธุรกิจของคุณในยุคดิจิทัล",
                        buttonText: "Free Consult",
                        buttonLink: "/contact",
                    },
                },
                {
                    type: "technologies",
                    order: 2,
                    content: {
                        title: "Powered by Modern Technologies",
                    },
                },
                {
                    type: "about",
                    order: 3,
                    content: {
                        title: "บริษัท ควอนจิเทค จำกัด",
                        description: "บริษัท ควอนจิเทค จำกัด ก่อตั้งขึ้นในปี 2560 จากทีมผู้เชี่ยวชาญด้าน Quantum, Digital และ IT เพื่อช่วยองค์กรปรับตัวและเติบโตในยุคดิจิทัล ด้วยประสบการณ์มากกว่า 10 ปี",
                        features: [
                            { title: "นวัตกรรมและเทคโนโลยี", text: "มุ่งเน้นการพัฒนาโซลูชันด้วยเทคโนโลยีล้ำสมัย รองรับการเปลี่ยนแปลงในอนาคต", icon: "FaMicrochip" },
                            { title: "ความเชี่ยวชาญและประสบการณ์", text: "ทีมงานมีประสบการณ์กว่า 10 ปีในด้าน Quantum, Digital และ IT", icon: "FaUserTie" },
                            { title: "พันธมิตรเพื่อการเติบโต", text: "สร้างความร่วมมือระยะยาว เพื่อขับเคลื่อนธุรกิจให้เติบโตอย่างยั่งยืน", icon: "FaHandshake" }
                        ],
                        image: "/img/default3.png"
                    },
                },
                {
                    type: "services",
                    order: 4,
                    content: {
                        title: "บริการของ quangitech",
                        description: "เราผสมผสานความคิดสร้างสรรค์ เทคโนโลยี และกลยุทธ์ เพื่อสร้างโซลูชันดิจิทัลที่ทันสมัย และช่วยธุรกิจคุณเติบโตอย่างมั่นคง"
                    },
                },
                {
                    type: "recent-works",
                    order: 5,
                    content: {},
                },
                {
                    type: "news-events",
                    order: 6,
                    content: {
                        title: "News & Events",
                        description: "ติดตามข่าวสารและกิจกรรมล่าสุดของเรา เพื่อไม่พลาดทุกความเคลื่อนไหว"
                    },
                },
                {
                    type: "why-choose-us",
                    order: 7,
                    content: {
                        title: "ทำไมต้องเลือก เรา?",
                        description: "เราคือพันธมิตรด้านดิจิทัลที่เข้าใจธุรกิจคุณ พร้อมสร้างโซลูชันที่ตอบโจทย์และขับเคลื่อนการเติบโตอย่างยั่งยืน",
                        features: [
                            { title: "พัฒนาเร็ว ทันใจ", description: "ทำงานรวดเร็ว มอบงานตรงเวลา พร้อมให้บริการตลอด 24 ชั่วโมง", icon: "FaRocket" },
                            { title: "ทีมงานมืออาชีพ", description: "ทีมงานมีประสบการณ์กว่า 5 ปี พร้อมให้คำปรึกษาอย่างเชี่ยวชาญ", icon: "FaUsers" },
                            { title: "มาตรฐานคุณภาพ", description: "รับประกันคุณภาพงาน พร้อมบริการหลังการขายอย่างต่อเนื่อง", icon: "FaShieldAlt" },
                            { title: "บริการครบวงจร", description: "ให้คำปรึกษา พัฒนา และดูแลระบบแบบครบวงจรในที่เดียว", icon: "FaHeadset" }
                        ],
                        image: "/img/default2.png"
                    },
                },
                {
                    type: "call-to-action",
                    order: 8,
                    content: {},
                },
                {
                    type: "clients",
                    order: 9,
                    content: {
                        title: "Trusted by Leading Clients"
                    }
                }
            ];

            for (const section of sections) {
                await fetch("/api/sections", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...section, pageId: page.id }),
                });
            }

            toast.success("Home page seeded successfully");
            fetchPages();
        } catch (error) {
            console.error("Error seeding home page:", error);
            toast.error("Failed to seed home page");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Pages Management</h1>
                    <p className="text-gray-500">Manage your website pages content</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={seedHomePage}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Seed Home Page
                    </Button>
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Create Page
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Page</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreatePage} className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={newSlug}
                                        onChange={(e) => setNewSlug(e.target.value)}
                                        required
                                        placeholder="e.g., home, about"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Create</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : pages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    No pages found
                                </TableCell>
                            </TableRow>
                        ) : (
                            pages.map((page) => (
                                <TableRow key={page.id}>
                                    <TableCell className="font-medium">{page.title}</TableCell>
                                    <TableCell>{page.slug}</TableCell>
                                    <TableCell>
                                        {new Date(page.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/backoffice/pages/${page.slug}`}>
                                                <Edit className="h-4 w-4 mr-2" /> Edit Content
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
