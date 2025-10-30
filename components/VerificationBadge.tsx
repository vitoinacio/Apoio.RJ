"use client";

import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const VerificationBadge = ({ verified }: { verified: boolean }) => {
  const cls = verified
    ? "border-green-600 bg-white text-green-600"
    : "border-red-600 bg-white text-red-600";
  return (
    <Badge className={cls} aria-live="polite">
      {verified ? (
        <>
          <Check className="mr-1 h-3 w-3" aria-hidden="true" />
          <span>Verificado</span>
        </>
      ) : (
        <>
          <X className="mr-1 h-3 w-3" aria-hidden="true" />
          <span>Não verificado</span>
        </>
      )}
    </Badge>
  );
};

export default VerificationBadge;
