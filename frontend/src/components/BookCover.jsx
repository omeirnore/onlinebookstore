import { useState } from "react";

const FALLBACK_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23f0d3ae'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='16' fill='%236a381c' text-anchor='middle' dominant-baseline='middle'%3ENo Cover%3C/text%3E%3C/svg%3E";

export default function BookCover({ src, alt, className }) {
  const [errored, setErrored] = useState(false);

  return (
    <img
      src={errored || !src ? FALLBACK_SVG : src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}
