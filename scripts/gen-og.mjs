// Generate the single branded Open Graph card (1200x630) → public/og-default.png.
// Dev-only: run with `node scripts/gen-og.mjs`. The brand fonts ship as woff2, which
// satori can't read, so we decompress one weight to OTF in-memory via wawoff2. Only the
// resulting PNG is committed — no new runtime dependencies.
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import * as wawoff2 from "wawoff2";
import { readFileSync, writeFileSync } from "node:fs";

const font = async (file) =>
  Buffer.from(await wawoff2.decompress(readFileSync(new URL(`../public/fonts/${file}`, import.meta.url))));

const switzerSemibold = await font("Switzer-Semibold.woff2");
const switzerRegular = await font("Switzer-Regular.woff2");

const span = (text, style) => ({ type: "span", props: { style, children: text } });

const tree = {
  type: "div",
  props: {
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "1200px",
      height: "630px",
      padding: "76px 80px",
      backgroundColor: "#140c0a",
      backgroundImage:
        "radial-gradient(at 78% 14%, rgba(178,120,66,0.34), rgba(178,120,66,0) 55%), linear-gradient(150deg, #2c1815 0%, #120a08 100%)",
      color: "#f7f3ec",
      fontFamily: "Switzer",
    },
    children: [
      {
        type: "div",
        props: {
          style: { display: "flex", alignItems: "center", gap: "14px" },
          children: [
            {
              type: "div",
              props: {
                style: { width: "10px", height: "10px", borderRadius: "10px", backgroundColor: "#c89a63" },
              },
            },
            span("KP Solutions", {
              fontSize: "25px",
              fontWeight: 600,
              letterSpacing: "6px",
              textTransform: "uppercase",
              color: "#c89a63",
            }),
          ],
        },
      },
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            fontSize: "72px",
            fontWeight: 600,
            lineHeight: 1.03,
            letterSpacing: "-2px",
            maxWidth: "920px",
          },
          children: span("Bespoke software for established operators.", {}),
        },
      },
      {
        type: "div",
        props: {
          style: { display: "flex" },
          children: span("kpsolutions.io", {
            fontSize: "25px",
            fontWeight: 400,
            color: "rgba(247,243,236,0.62)",
          }),
        },
      },
    ],
  },
};

const svg = await satori(tree, {
  width: 1200,
  height: 630,
  fonts: [
    { name: "Switzer", data: switzerSemibold, weight: 600, style: "normal" },
    { name: "Switzer", data: switzerRegular, weight: 400, style: "normal" },
  ],
});

const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
writeFileSync(new URL("../public/og-default.png", import.meta.url), png);
console.log(`og-default.png written (${png.length} bytes)`);
