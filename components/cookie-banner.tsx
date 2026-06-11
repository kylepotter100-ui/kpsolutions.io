"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { features } from "@/lib/config";

const CONSENT_KEY = "kp-cookie-consent";

const ease = [0.23, 1, 0.32, 1] as const;

export function CookieBanner(): ReactNode {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!features.analytics) return;
    try {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      if (stored !== "accepted" && stored !== "declined") {
        setVisible(true);
      }
    } catch {
      // Storage unavailable (private mode etc.) — without a place to record
      // consent we can't honour it, so keep the banner hidden and load nothing.
    }
  }, []);

  const choose = (value: "accepted" | "declined") => {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Ignore storage failures; the banner closes either way.
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease }}
          className="fixed bottom-4 left-1/2 z-9999 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="rounded-2xl bg-frame border border-border p-5 shadow-lg">
            <p className="text-sm leading-relaxed text-foreground">
              We&apos;d like to use analytics cookies to understand how the
              site is used. Nothing loads unless you accept.{" "}
              <a
                href="/cookies"
                className="font-medium underline-offset-4 underline hover:text-muted-foreground"
              >
                How we use cookies
              </a>
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => choose("declined")}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
