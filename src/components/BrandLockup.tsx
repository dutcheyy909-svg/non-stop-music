"use client";

import Image from "next/image";

export function BrandLockup({ size = 72 }: { size?: number }) {
  const inner = Math.round(size * 0.58);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <Image
        src="/brand/logo-seal.jpg"
        alt=""
        width={size}
        height={size}
        className="rounded-full ring-2 ring-fuchsia-400/80"
      />
      <div
        className="absolute overflow-hidden rounded-full ring-1 ring-fuchsia-200/50"
        style={{
          width: inner,
          height: inner,
          left: (size - inner) / 2,
          top: (size - inner) / 2.4,
        }}
      >
        <Image
          src="/brand/logo-portrait.jpg"
          alt="Dutcheyy Records"
          width={inner}
          height={inner}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
