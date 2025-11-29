"use client";
import React from "react";
import CallToAction from "@/components/ui/calltoaction";

export default function CallToActionSection({ content }) {
    return (
        <CallToAction
            title={content?.title}
            description={content?.description}
            buttonText={content?.buttonText}
            buttonLink={content?.buttonLink}
        />
    );
}
