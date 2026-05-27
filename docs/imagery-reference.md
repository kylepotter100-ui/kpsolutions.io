# Imagery Reference — KP Solutions

Single source of truth for all generated site imagery. The **first approved still**
(the homepage interlude) sets the visual register — palette, lighting, composition,
and mood — that every subsequent image must match. Imagery is generated via the
**Higgsfield MCP** and post-processed to AVIF/WebP before committing.

> **Direction (current).** Abstract **structural & architectural** register — the
> *software* domain. This supersedes the earlier "hands at craft / workshop / human
> figures" direction, which was the wrong register for a software studio brand and is
> now abandoned. All existing `PlaceholderLabel` briefs that describe craft/workshop
> scenes are to be rewritten against this reference as each image is produced.

---

## 1. Approved palette tokens

Imagery must live entirely within this range — **black → oxblood → ochre → bone**.
No cool blues, no purples, no greys that aren't warm. Values are the canonical
`tokens.css` OKLCH; hex/RGB are sRGB approximations for prompting image models.

| Token | Role in imagery | OKLCH | sRGB hex | RGB |
|-------|-----------------|-------|----------|-----|
| `--ox-900` | Deepest shadow / near-black | `oklch(13% 0.025 22)` | `#100404` | `16, 4, 4` |
| `--ox-800` | Deep shadow | `oklch(17% 0.040 22)` | `#1e0707` | `30, 7, 7` |
| `--ox-700` | Oxblood shadow | `oklch(22% 0.060 22)` | `#310c0d` | `49, 12, 13` |
| `--ox-500` | **Brand oxblood** (signature mid-dark) | `oklch(36% 0.110 22)` | `#6b1e21` | `107, 30, 33` |
| `--ox-300` | Lifted oxblood / dusty rose | `oklch(60% 0.115 22)` | `#bb6261` | `187, 98, 97` |
| `--ochre-700` | Warm mid — deep amber/terracotta | `oklch(54% 0.120 60)` | `#a05b11` | `160, 91, 17` |
| `--ochre-500` | **Warm mid — amber light source** | `oklch(72% 0.145 72)` | `#dc9322` | `220, 147, 34` |
| `--ochre-300` | Warm highlight — sand | `oklch(82% 0.110 78)` | `#ebbb6e` | `235, 187, 110` |
| `--bone-500` | Warm taupe mid | `oklch(42% 0.009 28)` | `#524b4a` | `82, 75, 74` |
| `--bone-200` | Soft light | `oklch(85% 0.014 40)` | `#d6cbc7` | `214, 203, 199` |
| `--bone-100` | Highlight | `oklch(92% 0.012 45)` | `#ece2de` | `236, 226, 222` |
| `--bone-50` | Bright bone | `oklch(96% 0.010 50)` | `#f8f0ec` | `248, 240, 236` |
| `--bone-0` | Brightest highlight | `oklch(98.5% 0.008 60)` | `#fef9f5` | `254, 249, 245` |

**Distribution.** Shadows and structure sit in `ox-900`→`ox-700`. The light source and
its warm pooling are `ochre-700`→`ochre-500`→`ochre-300`. Surfaces catching light
resolve to `bone-100`→`bone-0`. `ox-500` is the signature accent and should appear
somewhere in every frame.

## 2. Lighting language

- **Light is the subject; architecture frames it.** Every image is *about* the light.
- **Late-afternoon / end-of-day warm directional light** raking across structure at an
  oblique angle. A single dominant warm source (amber, `ochre-500`), not flat ambient.
- **Soft pooling and falloff** — light gradients from `bone-0` highlight to `ox-900`
  shadow across the frame. Visible **atmosphere**: fine dust/haze in the light beam.
- **Cinematic shallow depth of field** — one plane in focus, the rest softly resolved.
- No hard flat studio light, no high-key evenness, no lens flare gimmickry.

## 3. Composition principles

- **Wide aspect**, 16:9 or 2:1, built for **full-bleed section backgrounds**.
- **~40% of the frame is calm negative space** so site text overlays cleanly on one
  side (default: calmer space on the left, dominant form on the right — confirm per use).
- **Asymmetric balance.** One or two dominant geometric forms (beams, columns, planes,
  apertures), never a centred symmetrical hero.
- **Long sightlines and oblique structural lines** — depth through receding geometry.
- Generous emptiness over busy detail. The eye should rest.

## 4. Mood

Quiet, considered, premium. The feeling of an **empty, well-designed space at the end
of the working day** — light pooling, dust suspended, complete stillness. Restraint,
not drama. Never moody-for-its-own-sake, never corporate-stocky, never busy.

Reference register: high-end architectural photography (Tadao Ando, Peter Zumthor)
crossed with abstract cinematic stills.

## 5. Prohibited subject matter

Hard exclusions — these break the brand register and must never appear:

- **No human figures, hands, faces, or silhouettes of people.**
- **No craft / making scenes** — workshops, workbenches, studios, kilns, pottery.
- **No tools, instruments, or objects of human use.**
- **No manufacturing, fabrication, or any visible manual labour.**
- **No literal software UI / screens / code / dashboards / circuitry.**
- **No cool colours** — no blue, teal, cyan, purple, magenta, green.
- **No "AI-slop" aesthetics** — purple-to-blue gradients, sparkles, neon, lens flares,
  fake bokeh confetti, over-rendered hyperreal CGI sheen.
- **No text, logos, or watermarks** baked into the image.

## 6. Generation log

One row per **approved** image. Each entry records the delivered filename, the model,
the credit cost, and a link to the exact prompt that produced it. Iterations that were
not approved are not logged here (iteration costs are reported in chat during review).

| # | Placement | Filename | Model | Credits | Date | Prompt |
|---|-----------|----------|-------|---------|------|--------|
| _(none yet — first still pending generation; see `docs/imagery-prompts/01-homepage-interlude.md`)_ ||||||||

### Total credits spent on approved imagery: 0
