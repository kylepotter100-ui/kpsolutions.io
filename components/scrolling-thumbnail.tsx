"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollingThumbnailProps = {
  src: string;
  alt: string;
  className?: string;
  durationSeconds?: number;
};

// A tall image inside a fixed-height window that scrolls itself top → bottom →
// top in a slow loop, giving a glimpse of an entire long screenshot.
//
// The overflow is measured against the actual rendered image (its rendered
// width is the container's width, height scales by the natural aspect ratio),
// so the animation always travels exactly from the top edge of the image to
// the bottom and back — no over-scroll into white space, no under-scroll that
// leaves the bottom unseen.
export function ScrollingThumbnail({
  src,
  alt,
  className,
  durationSeconds = 28,
}: ScrollingThumbnailProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [overflow, setOverflow] = useState(0);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const img = imgRef.current;
      if (!container || !img) return;
      if (!img.naturalWidth || !img.naturalHeight) return;

      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const renderedHeight =
        (img.naturalHeight / img.naturalWidth) * containerWidth;

      setOverflow(Math.max(0, renderedHeight - containerHeight));
    };

    const img = imgRef.current;
    if (img?.complete) measure();
    img?.addEventListener("load", measure);

    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      img?.removeEventListener("load", measure);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className ?? ""}`}
    >
      <motion.img
        ref={imgRef}
        src={src}
        alt={alt}
        className="block w-full will-change-transform"
        animate={overflow > 0 ? { y: [0, -overflow, 0] } : { y: 0 }}
        transition={{
          duration: durationSeconds,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        loading="lazy"
      />
    </div>
  );
}
