"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash, ChevronDown, ChevronUp } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { IconPicker } from "./IconPicker";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function DynamicContentEditor({ content, onChange }) {
    const handleChange = (key, value) => {
        onChange({ ...content, [key]: value });
    };

    if (typeof content !== "object" || content === null) {
        return <div className="text-red-500">Invalid content structure</div>;
    }

    return (
        <div className="space-y-4">
            {Object.entries(content).map(([key, value]) => (
                <FieldEditor
                    key={key}
                    fieldKey={key}
                    value={value}
                    onChange={(newValue) => handleChange(key, newValue)}
                />
            ))}
        </div>
    );
}

function FieldEditor({ fieldKey, value, onChange }) {
    // Helper to format key as label (camelCase to Title Case)
    const label = fieldKey
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());

    // Detect field type
    const isImage = /image|img|photo|bg|background|src|url/i.test(fieldKey) && typeof value === "string";
    const isIcon = /icon/i.test(fieldKey) && typeof value === "string";
    const isLongText = typeof value === "string" && value.length > 50;
    const isBoolean = typeof value === "boolean";
    const isArray = Array.isArray(value);
    const isObject = typeof value === "object" && value !== null && !isArray;

    if (isImage) {
        return (
            <ImageUploader
                label={label}
                value={value}
                onChange={onChange}
            />
        );
    }

    if (isIcon) {
        return (
            <IconPicker
                label={label}
                value={value}
                onChange={onChange}
            />
        );
    }

    if (isBoolean) {
        return (
            <div className="flex items-center space-x-2">
                <Switch checked={value} onCheckedChange={onChange} id={fieldKey} />
                <Label htmlFor={fieldKey}>{label}</Label>
            </div>
        );
    }

    if (isArray) {
        return (
            <ArrayEditor
                label={label}
                value={value}
                onChange={onChange}
            />
        );
    }

    if (isObject) {
        return (
            <div className="border rounded-md p-4 bg-gray-50/50">
                <Label className="mb-2 block font-bold text-gray-700">{label}</Label>
                <DynamicContentEditor content={value} onChange={onChange} />
            </div>
        );
    }

    return (
        <div className="space-y-1.5">
            <Label htmlFor={fieldKey}>{label}</Label>
            {isLongText || fieldKey === "description" ? (
                <Textarea
                    id={fieldKey}
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="min-h-[100px]"
                />
            ) : (
                <Input
                    id={fieldKey}
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
        </div>
    );
}

function ArrayEditor({ label, value, onChange }) {
    const [isOpen, setIsOpen] = useState(true);

    const addItem = () => {
        // Try to infer the shape of new items based on existing ones
        let newItem = "";
        if (value.length > 0) {
            const firstItem = value[0];
            if (typeof firstItem === "object") {
                // Deep clone structure with empty values
                newItem = JSON.parse(JSON.stringify(firstItem, (k, v) => {
                    if (typeof v === "string") return "";
                    if (typeof v === "number") return 0;
                    if (typeof v === "boolean") return false;
                    return v;
                }));
            } else if (typeof firstItem === "number") {
                newItem = 0;
            } else if (typeof firstItem === "boolean") {
                newItem = false;
            }
        } else {
            // Default to object if empty, or string
            // This is a guess, might be wrong for empty arrays. 
            // Ideally we need a schema. For now, let's assume object if empty array.
            newItem = {};
        }

        onChange([...value, newItem]);
    };

    const removeItem = (index) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    const updateItem = (index, newItem) => {
        const newValue = [...value];
        newValue[index] = newItem;
        onChange(newValue);
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-md p-4 space-y-2">
            <div className="flex items-center justify-between">
                <Label className="font-bold text-gray-700">{label} ({value.length})</Label>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="space-y-4">
                {value.map((item, index) => (
                    <div key={index} className="relative border p-3 rounded-md bg-white group">
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <Button
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => removeItem(index)}
                            >
                                <Trash className="h-3 w-3" />
                            </Button>
                        </div>

                        {typeof item === "object" && item !== null ? (
                            <DynamicContentEditor
                                content={item}
                                onChange={(newItem) => updateItem(index, newItem)}
                            />
                        ) : (
                            <FieldEditor
                                fieldKey={`Item ${index + 1}`}
                                value={item}
                                onChange={(newItem) => updateItem(index, newItem)}
                            />
                        )}
                    </div>
                ))}

                <Button variant="outline" size="sm" onClick={addItem} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </CollapsibleContent>
        </Collapsible>
    );
}
