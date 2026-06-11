"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";

const testimonial = {
  quote:
    "Before working with KP Solutions I was manually messaging with clients to manage my diary and had no way to manage bookings effectively. Now my entire business is automated, the admin portal allows me to engage with customers effectively and I can focus on what matters. Flawless service end-to-end",
  name: "The Potter Sanctuary",
  title: "Bookings & client management platform",
  logo: "/sanctuary-logo.png",
  color: "#a8d946",
};

export function Testimonials(): ReactNode {
  return (
    <section
      id="testimonials"
      className="relative w-full overflow-hidden px-6 py-20 sm:py-24 scroll-mt-24"
    >
      <div
        className="absolute inset-0 bg-center bg-no-repeat brightness-110 blur-3xl scale-125 opacity-40"
        style={{ backgroundImage: "url(/BG.jpg)", backgroundSize: "cover" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background"
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="relative mx-auto max-w-5xl"
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-between gap-8">
            <h2 className="text-2xl sm:text-3xl font-medium leading-tight text-neutral-900 dark:text-neutral-50">
              Client story
            </h2>

            <div>
              <div className="relative inline-block">
                <div
                  className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full"
                  style={{ backgroundColor: testimonial.color }}
                >
                  <Image
                    src={testimonial.logo}
                    alt=""
                    width={64}
                    height={90}
                    className="h-full w-full object-contain p-1.5 [filter:brightness(0)_invert(1)]"
                  />
                </div>
                <svg
                  className="absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)] -rotate-90"
                  viewBox="0 0 100 100"
                  aria-hidden="true"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke={testimonial.color}
                    strokeWidth="1.5"
                    opacity="0.2"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke={testimonial.color}
                    strokeWidth="1.5"
                    strokeDasharray={`${2 * Math.PI * 48}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{
                      duration: 10,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="mt-5 block text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                {testimonial.name}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <blockquote className="text-xl leading-relaxed text-neutral-700 dark:text-neutral-300">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <div className="text-base font-medium text-neutral-900 sm:text-lg dark:text-neutral-100">
              {testimonial.name},{" "}
              <span className="text-neutral-600 dark:text-neutral-400">
                {testimonial.title}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
