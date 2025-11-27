"use client";

import { Badge } from "@/components/ui/badge";
import { Check, Clock, X } from "lucide-react";
import type { SuggestionStatus } from "@/types/suggestion";

type Props = { status: SuggestionStatus };

const STATUS_CONFIG: Record<
  SuggestionStatus,
  {
    label: string;
    cls: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  aprovado: {
    label: "Aprovado",
    cls: "border-green-600 bg-white text-green-600",
    Icon: Check,
  },
  pendente: {
    label: "Pendente",
    cls: "border-amber-600 bg-white text-amber-700",
    Icon: Clock,
  },
  rejeitado: {
    label: "Rejeitado",
    cls: "border-red-600 bg-white text-red-600",
    Icon: X,
  },
};

const VerificationBadge = ({ status }: Props) => {
  const { label, cls, Icon } = STATUS_CONFIG[status];
  return (
    <Badge className={cls} role="status" aria-label={`Status: ${label}`}>
      <Icon className="mr-1 h-3 w-3" aria-hidden="true" />
      <span>{label}</span>
    </Badge>
  );
};

export default VerificationBadge;
