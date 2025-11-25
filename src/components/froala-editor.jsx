"use client";

import React, { useState } from "react";
import EditorQuill from "@/components/EditorQuill";

export default function FroalaEditor({ content, onChange }) {
  return (
    <div className="froala-container">
      <EditorQuill value={content || ""} onChange={onChange} />
    </div>
  );
}
