"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState, type ReactNode } from "react";

const testimonials = [
  {
    quote:
      "Before working with KP Solutions I was manually messaging with clients to manage my diary and had no way to manage bookings effectively. Now my entire business is automated, the admin portal allows me to engage with customers effectively and I can focus on what matters. Flawless service end-to-end",
    name: "The Potter Sanctuary",
    title: "Bookings & client management platform",
    logo: "/sanctuary-logo.png",
    color: "#a8d946",
    company: "The Potter Sanctuary",
  },
];

const companies = [{ name: "The Potter Sanctuary" }];

export function Testimonials(): ReactNode {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="testimonials"
      className="relative w-full overflow-hidden border-t border-b border-accent/15 px-6 py-32 scroll-mt-24"
    >
      <div
        className="absolute inset-0 bg-center bg-no-repeat brightness-110 blur-3xl scale-125 opacity-50"
        style={{ backgroundImage: "url(/BG.jpg)", backgroundSize: "cover" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/80"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-16 text-4xl leading-tight font-medium text-neutral-900 sm:text-5xl lg:mb-20 lg:text-6xl dark:text-neutral-50"
        >
          Client story
        </motion.h2>

        <div className="mb-16 grid gap-8 lg:mb-20 lg:grid-cols-2 lg:gap-12">
          <div className="flex items-center justify-start gap-4 lg:gap-6" role="tablist" aria-label="Client stories">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: activeIndex === index ? 1.1 : 0.9,
                  opacity: activeIndex === index ? 1 : 0.6,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="relative"
                role="tab"
                aria-selected={activeIndex === index}
                tabIndex={activeIndex === index ? 0 : -1}
                onClick={() => setActiveIndex(index)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-colors duration-500 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
                  style={{
                    backgroundColor:
                      activeIndex === index ? testimonial.color : undefined,
                  }}
                >
                  <Image
                    src={testimonial.logo}
                    alt={testimonial.name}
                    width={64}
                    height={90}
                    className="h-full w-full object-contain p-1.5 [filter:brightness(0)_invert(1)]"
                  />
                </div>

                {activeIndex === index && (
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
                      key={`progress-${activeIndex}`}
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke={testimonial.color}
                      strokeWidth="1.5"
                      strokeDasharray={`${2 * Math.PI * 48}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 10, ease: "linear" }}
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col justify-center" role="tabpanel" aria-live="polite">
            <AnimatePresence mode="wait">
              {testimonials[activeIndex] && (
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <blockquote className="mb-6 text-xl leading-relaxed text-neutral-700 dark:text-neutral-300">
                    &ldquo;{testimonials[activeIndex].quote}&rdquo;
                  </blockquote>
                  <div className="text-base font-medium text-neutral-900 sm:text-lg dark:text-neutral-100">
                    {testimonials[activeIndex].name},{" "}
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {testimonials[activeIndex].title}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center justify-between gap-6 lg:gap-8">
          {companies.map((company, index) => {
            const isActive = testimonials[activeIndex]?.company === company.name;
            return (
              <motion.div
                key={company.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                className="flex items-center"
              >
                <span
                  className={`text-lg font-semibold tracking-tight transition-colors duration-300 sm:text-xl ${
                    isActive
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-400 dark:text-neutral-600"
                  }`}
                >
                  {company.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
