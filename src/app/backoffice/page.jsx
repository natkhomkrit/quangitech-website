"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";
import StatusCards from "@/components/StatusCards";

export default function BackofficeDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <Button asChild>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>View website</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StatusCards />
            <div className="mt-6">
              <QuickActions />
            </div>
          </div>

          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
