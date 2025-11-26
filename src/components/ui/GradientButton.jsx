"use client";

import Link from "next/link";
import clsx from "clsx";

export default function GradientButton({
    href,
    children,
    className,
    showArrow = true,
    ...props
}) {
    return (
        <Link href={href} {...props}>
            <div
                className={clsx(
                    "relative inline-block \
        bg-gray-900 text-white hover:bg-black \
        font-medium text-sm \
        rounded-full px-6 py-2 \
        shadow-lg shadow-gray-400/50 hover:shadow-xl \
        transition-all duration-300 transform hover:-translate-y-1 \
        overflow-hidden group",
                    className
                )}
            >
                <span className="relative z-10 flex items-center gap-2">
                    {children}
                    {showArrow && (
                        <svg
                            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    )}
                </span>
            </div>
        </Link>
    );
}
