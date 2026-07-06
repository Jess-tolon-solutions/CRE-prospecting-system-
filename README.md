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
├── new-prospect.mjs              # scaffold a prospect from a config → HTML + PDFs + previews
├── build.mjs                     # render any *.html → print-ready single-source PDF
├── preview.mjs                   # render a PNG of every page → previews/ (2x, clipped to sheet)
├── docs/
│   └── system-outline.md         # the framework: sections, signal taxonomy, how to adapt
├── templates/                    # tokenized source ({{COMPANY}}, {{MARKET}}, {{FOCUS}}, …)
│   ├── 01-growth-system.html
│   └── 02-signal-report.html
├── prospects/                    # one small config file per prospect
│   ├── _TEMPLATE.json            # copy this to start a new one
│   └── capital-asset-management.json
└── examples/
    └── capital-asset-management/ # first delivered build — Phoenix, industrial pilot
        ├── README.md
        ├── 01-growth-system.html
        ├── 01-growth-system.pdf
        ├── 02-signal-report.html
        ├── 02-signal-report.pdf
        └── previews/             # PNG previews of each page
```

`templates/` holds the tokenized source. `prospects/` holds one config per prospect.
`examples/` holds the generated + delivered builds, as proof and reference.

---

## Create a new prospect (the easy path)

Everything that changes per prospect lives in one small config file. Copy the
template, edit the fields, run one command:

```bash
cp prospects/_TEMPLATE.json prospects/acme-realty.json
# edit prospects/acme-realty.json  (see fields below)
node new-prospect.mjs prospects/acme-realty.json
```

That fills the templates, writes `examples/acme-realty/`, and renders both PDFs
**and** PNG previews of every page into `examples/acme-realty/previews/`.

**Config fields:**

| Field | Example | Fills |
| --- | --- | --- |
| `slug` | `acme-realty` | the `examples/<slug>/` folder name |
| `company` | `Acme Realty Partners` | "prepared for …", titles, footers |
| `companyShort` | `Acme` | "Generated for …", "against …'s criteria" |
| `market` | `Denver Metro` | report market line, framing |
| `marketShort` | `Denver` | "This week: Denver …", the pilot line, brief flag |
| `focus` | `office` | property-type labels, "…-led", "TOP OFFICE SIGNAL", pilot |
| `footprint` | `Colorado footprint` | the Growth System hero line |

Short/upper/title variants (`CAM` → `PHOENIX`, `office` → `Office` → `OFFICE`) are
derived automatically. The generator errors out if any token is left unfilled.

> The **framing** is fully automated. The six **signal rows** and the **featured
> brief** in the Signal Report are illustrative — after generating, replace them
> with real intel for the market (they're marked `SAMPLE` in the HTML), then
> re-run `node build.mjs examples/<slug>`. Those specific signals are the actual
> research each engagement does.

---

## Rendering PDFs

The HTML is self-contained (Google Fonts via CDN) and designed to print to a clean
US Letter PDF with true zero margins, so the full-bleed black bands reach the edge.

```bash
node build.mjs examples/capital-asset-management   # PDFs for both docs in a folder
node build.mjs templates/01-growth-system.html     # PDF for a single file
node preview.mjs examples/capital-asset-management  # PNG preview of every page → previews/
```

Requires Google Chrome (set `CHROME_BIN` if it's not at the default macOS path).
You can also just open a file in Chrome → **Print → Save as PDF**, paper **Letter**,
margins **None**, **Background graphics ON**.

---

## Roadmap

- **Now:** Phoenix, industrial-led (Capital Asset Management).
- **Next:** additional markets and verticals (retail, office, land, management),
  and additional prospects — each as a new folder under `examples/`.
