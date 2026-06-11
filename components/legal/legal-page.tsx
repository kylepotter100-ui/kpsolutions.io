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
    <main id="main-content" className="flex-1 px-6 pt-40 pb-24 max-[850px]:pt-28">
      <div className="mx-auto max-w-3xl">
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
