export interface Capability {
  id: string;
  label: string;
  copy: string;
  href: string;
}

// Single source of truth for the homepage capability rows — rendered by
// CapabilityTiles and emitted as Service JSON-LD by the homepage, so the
// structured data always matches the visible copy.
export const capabilities: Capability[] = [
  {
    id: "bespoke",
    label: "Bespoke software",
    copy: "Custom platforms, internal tools, and integrations built around how your business actually works.",
    href: "/build#bespoke",
  },
  {
    id: "aeo",
    label: "AI-visible web presence",
    copy: "Websites engineered to be found and cited by ChatGPT, Claude, Perplexity, and Google AI — not just indexed by traditional search.",
    href: "/build#aeo",
  },
  {
    id: "ai-ops",
    label: "AI built into your operations",
    copy: "AI used quietly inside your workflows, where it earns its keep — never as a sticker on a homepage.",
    href: "/build#ai-ops",
  },
];
