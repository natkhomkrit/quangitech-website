import React from "react";

export function TitleWithHighlight({ title, defaultTitle = "" }) {
    const text = title || defaultTitle;

    if (!text) return null;

    // Check if "quangitech" exists in the text (case-insensitive)
    const hasKeyword = /quangitech/i.test(text);

    if (hasKeyword) {
        return (
            <>
                {text.split(/(quangitech)/i).map((part, i) => (
                    <React.Fragment key={i}>
                        {part.toLowerCase() === "quangitech" ? (
                            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                {part}
                            </span>
                        ) : (
                            part
                        )}
                    </React.Fragment>
                ))}
            </>
        );
    }

    return <>{text}</>;
}
