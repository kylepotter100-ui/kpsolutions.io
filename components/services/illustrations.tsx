import type { ReactNode } from "react";

// Decorative SVG illustrations for the four /services capability sections.
// Built from primitives only — current tokens (text-accent, text-foreground,
// bg-frame) and basic shapes. No new colours, no external assets.

type IllustrationProps = {
  className?: string;
};

export function BespokeIllustration({
  className = "",
}: IllustrationProps): ReactNode {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Bespoke software: shapes fitted to fit the work"
    >
      <rect
        x="8"
        y="12"
        width="40"
        height="40"
        rx="10"
        className="fill-foreground"
      />
      <circle cx="84" cy="32" r="22" className="fill-accent" />
      <rect
        x="14"
        y="64"
        width="56"
        height="20"
        rx="10"
        className="fill-muted-foreground/30"
      />
      <rect
        x="60"
        y="64"
        width="48"
        height="48"
        rx="14"
        transform="rotate(8 84 88)"
        className="fill-foreground"
      />
    </svg>
  );
}

export function ModernizationIllustration({
  className = "",
}: IllustrationProps): ReactNode {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Modernization: replacing the legacy tangle with one platform"
    >
      <g className="stroke-muted-foreground/40" strokeDasharray="3 3" fill="none">
        <rect x="8" y="8" width="24" height="24" rx="4" strokeWidth="1.5" />
        <rect x="40" y="8" width="24" height="24" rx="4" strokeWidth="1.5" />
        <rect x="72" y="8" width="24" height="24" rx="4" strokeWidth="1.5" />
        <rect x="8" y="40" width="24" height="24" rx="4" strokeWidth="1.5" />
        <rect x="72" y="40" width="24" height="24" rx="4" strokeWidth="1.5" />
      </g>
      <rect
        x="20"
        y="56"
        width="80"
        height="48"
        rx="12"
        className="fill-foreground"
      />
      <circle cx="60" cy="80" r="14" className="fill-accent" />
      <path
        d="M52 80 L58 86 L70 74"
        className="stroke-foreground"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IntegrationsIllustration({
  className = "",
}: IllustrationProps): ReactNode {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Integrations: the systems connected, the work flowing through them"
    >
      <g
        className="stroke-muted-foreground/50"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <line x1="22" y1="22" x2="60" y2="60" />
        <line x1="98" y1="22" x2="60" y2="60" />
        <line x1="22" y1="98" x2="60" y2="60" />
        <line x1="98" y1="98" x2="60" y2="60" />
      </g>
      <circle cx="22" cy="22" r="12" className="fill-foreground" />
      <circle cx="98" cy="22" r="12" className="fill-foreground" />
      <circle cx="22" cy="98" r="12" className="fill-foreground" />
      <circle cx="98" cy="98" r="12" className="fill-foreground" />
      <circle cx="60" cy="60" r="18" className="fill-accent" />
    </svg>
  );
}

export function AiVisibleIllustration({
  className = "",
}: IllustrationProps): ReactNode {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="AI-visible web presence: the signal that reaches the recommendation engines"
    >
      <g
        className="stroke-muted-foreground/40"
        strokeWidth="1.5"
        fill="none"
      >
        <circle cx="60" cy="60" r="48" />
        <circle cx="60" cy="60" r="34" />
      </g>
      <circle
        cx="60"
        cy="60"
        r="22"
        className="fill-foreground/10 stroke-foreground"
        strokeWidth="1.5"
      />
      <circle cx="60" cy="60" r="10" className="fill-accent" />
      <circle cx="60" cy="60" r="3.5" className="fill-foreground" />
    </svg>
  );
}

export const illustrationsById: Record<
  string,
  (props: IllustrationProps) => ReactNode
> = {
  bespoke: BespokeIllustration,
  modernization: ModernizationIllustration,
  integrations: IntegrationsIllustration,
  aeo: AiVisibleIllustration,
};
