"use client";

import { ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ProfileAvatarProps {
  name: string;
  /** Photo URL, or null to show initials. */
  src: string | null;
  verified?: boolean;
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (
    (parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")
  ).toUpperCase();
}

export function ProfileAvatar({
  name,
  src,
  verified = false,
}: ProfileAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = src?.trim() || null;
  const hasImage = imageSrc !== null && !imageFailed;
  const accessibleName = name.trim() || "Profile";

  useEffect(() => {
    setImageFailed(false);
  }, [imageSrc]);

  return (
    <div className="relative h-22 w-22 shrink-0">
      {hasImage ? (
        <Image
          src={imageSrc!}
          alt={`${accessibleName}'s profile photo`}
          width={88}
          height={88}
          sizes="88px"
          onError={() => setImageFailed(true)}
          // Local previews (blob:) can't go through the image optimiser.
          unoptimized={imageSrc!.startsWith("blob:")}
          className="h-full w-full rounded-2xl object-cover ring-1 ring-line"
        />
      ) : (
        <span
          role="img"
          aria-label={`${accessibleName}, no profile photo`}
          className="grid h-full w-full place-items-center rounded-2xl bg-accent-soft text-2xl font-bold text-accent ring-1 ring-line"
        >
          {initialsOf(accessibleName) || "?"}
        </span>
      )}

      {verified && (
        <span
          title="Identity verified"
          className="absolute -bottom-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full bg-good text-accent-ink ring-2 ring-surface"
        >
          <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
          <span className="sr-only">Identity verified</span>
        </span>
      )}
    </div>
  );
}
