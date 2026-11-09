"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { StatementImportView } from "./StatementImportView";

interface StatementImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StatementImportDialog({
  isOpen,
  onClose,
}: StatementImportDialogProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="statement-import-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mx-auto my-2 w-full max-w-[1180px] sm:my-4">
        <StatementImportView onClose={onClose} />
      </div>
    </div>,
    document.body,
  );
}
