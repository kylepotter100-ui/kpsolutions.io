export const PS_DOMAIN = "thepottersanctuary.co.uk";
export const PS_URL = "https://thepottersanctuary.co.uk";

export const PS_SHOT = "/case-studies/potter-sanctuary.avif";
export const PS_SHOT_MOBILE = "/case-studies/potter-sanctuary-mobile.avif";
export const PS_SCROLL = "/sanctuary-testimonial.jpeg";

export type CaseStudy = {
  id: string;
  title: string;
  accent: string;
  tagline: string;
  meta: { label: string; value: string }[];
  body: string[];
  liveUrl: string;
  liveLabel: string;
  image: string;
  imageMobile: string;
  scrollingThumbnail: string;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "potter-sanctuary",
    title: "Potter",
    accent: "Sanctuary",
    tagline:
      "Brand, editorial site, integrated bookings, accounts, admin. Live.",
    meta: [
      { label: "Client", value: "Potter Sanctuary" },
      {
        label: "Scope",
        value:
          "Brand · editorial site · booking · accounts · admin · AEO layer",
      },
      { label: "Shipped", value: "Feb 2026" },
    ],
    body: [
      "A new wellness practice with no real online presence and a booking process that lived entirely in text messages and social media DMs. Every enquiry, every reschedule, every availability question ran through the owner's personal inbox — workable for a handful of clients, unsustainable as the practice grew.",
      "We built the business a **complete foundation**: a branded editorial website engineered to be **found and cited by AI search**, not just listed in traditional results; an **integrated booking system** wired directly into the site; client accounts; and a full **admin portal** where the owner sets her availability and watches it appear live on the site in real time. Booking moved out of the DMs and into a system the business actually controls — the owner manages her own calendar, clients book themselves, and the practice has a presence that works whether someone finds it through Google or **asks an AI assistant for a recommendation**.",
    ],
    liveUrl: PS_URL,
    liveLabel: PS_DOMAIN,
    image: PS_SHOT,
    imageMobile: PS_SHOT_MOBILE,
    scrollingThumbnail: PS_SCROLL,
  },
];
