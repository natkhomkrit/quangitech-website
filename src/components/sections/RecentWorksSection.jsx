"use client";
import React from "react";
import RecentWorks from "@/components/RecentWorks";

export default function RecentWorksSection({ content }) {
    return <RecentWorks title={content?.title} description={content?.description} />;
}
