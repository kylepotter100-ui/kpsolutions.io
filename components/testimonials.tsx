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

const companies = [{ name: "The Potter Sanctuary" }];

export function Testimonials(): ReactNode {
  return (
    <section
      id="testimonials"
      className="w-full bg-frame px-6 py-32 scroll-mt-24"
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-16 text-4xl leading-tight font-medium text-neutral-900 sm:text-5xl lg:mb-20 lg:text-6xl dark:text-neutral-50"
        >
          Trusted by the businesses we build for
        </motion.h2>

        <div className="mb-16 grid gap-8 lg:mb-20 lg:grid-cols-2 lg:gap-12">
          <div className="flex items-center justify-start gap-4 lg:gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative"
            >
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
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <blockquote className="mb-6 text-xl leading-relaxed text-neutral-700 dark:text-neutral-300">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <div className="text-base font-medium text-neutral-900 sm:text-lg dark:text-neutral-100">
              {testimonial.name},{" "}
              <span className="text-neutral-600 dark:text-neutral-400">
                {testimonial.title}
              </span>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center justify-between gap-6 lg:gap-8">
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center"
            >
              <span className="text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl dark:text-white">
                {company.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
