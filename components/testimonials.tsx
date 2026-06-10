"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const testimonial = {
  quote:
    "Before working with KP Solutions I was manually messaging with clients to manage my diary and had no way to manage bookings effectively. Not my entire business is automated, the admin portal allows me to engage with customers effectively and I can focus on what matters. Flawless service end-to-end",
  name: "The Potter Sanctuary",
  title: "Bookings & client management platform",
  monogram: "PS",
};

export function Testimonials(): ReactNode {
  return (
    <section
      id="testimonials"
      className="w-full bg-frame border-t border-b border-accent/15 px-6 py-32 scroll-mt-24"
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-16 text-4xl leading-tight font-medium text-neutral-900 sm:text-5xl lg:mb-20 lg:text-6xl dark:text-neutral-50"
        >
          Client story
        </motion.h2>

        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-row items-center gap-5 lg:flex-col lg:items-start lg:gap-6"
          >
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent sm:h-24 sm:w-24"
              aria-hidden="true"
            >
              <span className="font-serif text-2xl font-semibold italic tracking-tight text-black sm:text-3xl">
                {testimonial.monogram}
              </span>
            </div>
            <div>
              <div className="text-base font-medium text-neutral-900 sm:text-lg dark:text-neutral-100">
                {testimonial.name}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {testimonial.title}
              </div>
            </div>
          </motion.div>

          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl leading-relaxed text-neutral-700 sm:text-2xl dark:text-neutral-300"
          >
            &ldquo;{testimonial.quote}&rdquo;
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
}
