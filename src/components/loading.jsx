"use client";

import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Loader2 } from "lucide-react";

export default function Loading({ loading }) {
  return (
    <Dialog open={loading} onOpenChange={() => { }}>
      <DialogContent className="flex items-center justify-center w-auto p-6 rounded-lg">
        <VisuallyHidden>
          <DialogTitle>Loading</DialogTitle>
        </VisuallyHidden>
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg font-medium text-gray-700">Loading...</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
