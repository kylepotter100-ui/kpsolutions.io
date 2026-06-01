// Potter Sanctuary — live site + screenshot asset. Single source so the
// case study and the homepage Work section stay in sync.
export const PS_DOMAIN = "thepottersanctuary.co.uk";
export const PS_URL = "https://thepottersanctuary.co.uk";

// Full-page screenshots of the live homepage (AVIF). Desktop is a wide capture;
// mobile is a narrow single-column capture served to phones via <picture>.
export const PS_SHOT = "/case-studies/potter-sanctuary.avif";
export const PS_SHOT_MOBILE = "/case-studies/potter-sanctuary-mobile.avif";

// Case studies — sibling entries rendered on /work. The first (and currently only) one is
// Potter Sanctuary; add more by appending to this array.
export interface CaseStudy {
  id: string;
  title: string;
  body: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: "potter-sanctuary",
    title: "Potter Sanctuary",
    body: [
      "A new wellness practice with no real online presence and a booking process that lived entirely in text messages and social media DMs. Every enquiry, every reschedule, every availability question ran through the owner's personal inbox — workable for a handful of clients, unsustainable as the practice grew.",
      "We built the business a complete foundation: a branded editorial website engineered to be found and cited by AI search, not just listed in traditional results; an integrated booking system wired directly into the site; client accounts; and a full admin portal where the owner sets her availability and watches it appear live on the site in real time. Booking moved out of the DMs and into a system the business actually controls — the owner manages her own calendar, clients book themselves, and the practice has a presence that works whether someone finds it through Google or asks an AI assistant for a recommendation.",
    ],
  },
];

