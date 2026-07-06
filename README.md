# CRE Prospecting System

A lead-magnet pitch kit for commercial real estate firms. It turns a signal-first
prospecting system into two short, sendable documents that make the offer legible
to a busy CRE principal or VP:

1. **The Growth System** — a one-page overview of how the system sources signals,
   qualifies them, and routes a ranked call list to the team every Monday.
2. **The Monday Signal Report** — a sample of the actual deliverable, so the
   prospect sees exactly what lands on an agent's desk.

Built on the **Tolon Solutions** brand system (black + cream, Manrope + Lato,
sharp corners, `Tolon.` wordmark). By Jessica Tolon — fractional CMO who builds
the systems she recommends.

---

## The thesis

**No signal, no send.** Every opportunity in a market — a rezoning, a permit, a
loan maturity, an expiring lease, an ownership change — shows up in public records
first. The system reads them continuously, scores each against the firm's criteria,
and hands the team only the names worth a call, each shipped with the assets to act
(a one-pager, an email draft, a call script). Nothing goes out without a person.

*One assignment this surfaces covers a year of the system.*

---

## Repo structure

```
CRE-prospecting-system/
├── README.md                     # you are here
├── build.mjs                     # render any *.html → print-ready single-source PDF
├── docs/
│   └── system-outline.md         # the framework: sections, signal taxonomy, how to adapt
├── templates/                    # reusable working source — copy per prospect
│   ├── 01-growth-system.html
│   └── 02-signal-report.html
└── examples/
    └── capital-asset-management/ # first delivered build — Phoenix, industrial pilot
        ├── README.md
        ├── 01-growth-system.html
        ├── 01-growth-system.pdf
        ├── 02-signal-report.html
        ├── 02-signal-report.pdf
        └── previews/             # PNG previews of each page
```

`templates/` holds the latest working files you copy and adapt for a new prospect.
`examples/` freezes what was actually delivered, as proof and reference.

---

## Rendering PDFs

The HTML is self-contained (Google Fonts via CDN) and designed to print to a clean
US Letter PDF with true zero margins, so the full-bleed black bands reach the edge.

```bash
node build.mjs examples/capital-asset-management   # render both docs in a folder
node build.mjs templates/01-growth-system.html     # render a single file
```

Requires Google Chrome (set `CHROME_BIN` if it's not at the default macOS path).
You can also just open a file in Chrome → **Print → Save as PDF**, paper **Letter**,
margins **None**, **Background graphics ON**.

---

## Adapting for a new prospect, market, or vertical

The current build targets **Capital Asset Management** (Phoenix, industrial-led).
To spin up a new one, copy `templates/` and swap the market-specific fields listed
in [`docs/system-outline.md`](docs/system-outline.md#adapting-per-prospect) —
prospect name, market, footprint, signal weighting, the featured opportunity,
contacts, and the pilot line. Start narrow (one market, one vertical) and let the
"same engine covers the rest" line carry the upsell.

## Roadmap

- **Now:** Phoenix, industrial-led (Capital Asset Management).
- **Next:** additional markets and verticals (retail, office, land, management),
  and additional prospects — each as a new folder under `examples/`.
