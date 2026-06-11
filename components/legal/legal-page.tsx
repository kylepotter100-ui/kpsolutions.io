import type { ReactNode } from "react";

type LegalPageProps = {
  title: string;
  accent?: string;
  updated: string;
  lead: ReactNode;
  children: ReactNode;
};

export function LegalPage({
  title,
  accent,
  updated,
  lead,
  children,
}: LegalPageProps): ReactNode {
  return (
    <main id="main-content" className="relative flex-1 overflow-hidden px-6 pt-40 pb-24 max-[850px]:pt-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-center bg-no-repeat brightness-110 blur-3xl scale-125 opacity-40"
          style={{ backgroundImage: "url(/BG.jpg)", backgroundSize: "cover" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/80 to-background" />
      </div>
      <div className="relative mx-auto max-w-3xl">
        <h1 className="text-6xl max-[850px]:text-4xl font-medium tracking-tight leading-[1.1] text-foreground">
          {title}
          {accent ? (
            <>
              {" "}
              <span className="italic font-serif text-accent">{accent}</span>
            </>
          ) : null}
          .
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated {updated}
        </p>
        <p className="mt-8 text-lg leading-relaxed text-foreground">{lead}</p>
        <div className="mt-12 space-y-10 text-base leading-relaxed text-foreground [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:mb-3 [&_p]:text-muted-foreground [&_a]:text-foreground [&_a]:underline-offset-4 [&_a:hover]:underline">
          {children}
        </div>
      </div>
    </main>
  );
}
