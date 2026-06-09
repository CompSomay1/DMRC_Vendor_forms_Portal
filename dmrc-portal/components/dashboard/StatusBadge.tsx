"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, FileEdit, Send, Search } from "lucide-react";
import { Status } from "@/types/application";

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  [Status.DRAFT]: {
    label: "Draft",
    icon: FileEdit,
    className:
      "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100",
  },
  [Status.SUBMITTED]: {
    label: "Submitted",
    icon: Send,
    className:
      "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
  [Status.UNDER_REVIEW]: {
    label: "Under Review",
    icon: Search,
    className:
      "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  },
  [Status.APPROVED]: {
    label: "Approved",
    icon: CheckCircle2,
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  },
  [Status.REJECTED]: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  },
};

const sizeConfig = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-3 py-1 gap-1.5",
  lg: "text-base px-4 py-1.5 gap-2",
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${sizeConfig[size]} font-semibold border transition-colors`}
    >
      <Icon className={iconSizes[size]} />
      {config.label}
    </Badge>
  );
}
