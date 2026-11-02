"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  PROFILE_PHOTO_MAX_BYTES,
  PROFILE_PHOTO_MIME_TYPES,
} from "../types";

const ACCEPTED: readonly string[] = PROFILE_PHOTO_MIME_TYPES;

interface PhotoControlsProps {
  hasPhoto: boolean;
  disabled?: boolean;
  /** A valid new image, or null to remove the current one. */
  onChange: (file: File | null) => void;
}

export function PhotoControls({
  hasPhoto,
  disabled = false,
  onChange,
}: PhotoControlsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError("Use a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > PROFILE_PHOTO_MAX_BYTES) {
      setError("That image is over 5 MB. Choose a smaller one.");
      return;
    }
    setError(null);
    onChange(file);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="sr-only"
          tabIndex={-1}
          aria-label="Upload profile photo"
          aria-describedby={error ? "profile-photo-error" : undefined}
          disabled={disabled}
          onChange={(e: { target: HTMLInputElement }) => {
            handleFile(e.target.files?.[0]);
            e.target.value = ""; // allow choosing the same file again
          }}
        />
        <Button
          variant="soft"
          size="sm"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="min-h-9 px-3.5 text-ink"
        >
          <Camera aria-hidden="true" className="h-4 w-4" />
          Change Photo
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled || !hasPhoto}
          onClick={() => {
            setError(null);
            onChange(null);
          }}
          className="min-h-9 px-3.5"
        >
          Remove
        </Button>
        <span className="text-xs text-muted">JPG, PNG, WebP up to 5MB</span>
      </div>
      {error && (
        <p
          id="profile-photo-error"
          role="alert"
          aria-live="polite"
          className="mt-2 text-xs font-medium text-bad"
        >
          {error}
        </p>
      )}
    </div>
  );
}
