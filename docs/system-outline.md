# System outline

The framework behind the two documents, and how to adapt them per prospect.

---

## The two documents

### Document 1 — The Growth System (one page)

The "how it works" overview. One printed page, five moves top to bottom:

1. **Hero** — the problem, stated plainly. *"The opportunities are already public."*
   The market's opportunities show up in public records first; the team doesn't
   have the hours to read them.
2. **What the system watches** (outbound) — a `Sourced from` chip row plus the
   **signal taxonomy** table (see below). This is the credibility layer.
3. **The smart front door** (inbound) — the qualifier lives on the prospect's
   **website and inbound forms**. A real prospect is scored and routed to the right
   agent instantly, instead of sitting in a pile. Not phones or personal inboxes —
   which makes it honest to build and ties into website + ABM scope.
4. **The engine** — both streams run one pipeline: Resolve & qualify → Score & rank
   → Weekly Signal Report → **You approve & send** (human-gated).
5. **Closer** — *"No signal, no send."* · *"I own the orchestration. Your team owns
   the output."* · the value line · a soft next step (a four-week pilot).

### Document 2 — The Monday Signal Report (two pages)

The deliverable itself, so the prospect sees what they'd actually receive.

- **Page 1 — the list.** A ranked table of ~6 signals: Target & contact · Signal ·
  What it surfaces · Score · Move · feeds · assets. Every row ships with the same
  three asset stubs: `[One-pager] · [Email draft] · [Call script]`.
- **Page 2 — what lands on the agent's desk.** The top signal expanded into a full
  brief — signal + why, suggested move, contact — with the three ready-to-send
  assets as previews, then a Review → Approve → Send handoff and the
  "How it's built" footer.

Header says **Generated for [PROSPECT]**, not "generated automatically" — it doesn't
overstate the automation. A disclaimer notes the sample uses illustrative signals.

---

## The signal taxonomy

The heart of the credibility. Signals are grouped by the practice area they feed.

**Development · acquisition · leasing**

| Signal | What it surfaces | Feeds |
| --- | --- | --- |
| Rezoning filings, GPA / PAD applications, tax-delinquent or underused parcels | Land & assemblage opportunities | Site acquisition |
| Competitor permits pulled, infrastructure announcements | Where demand is heading before it's obvious | Pipeline strategy |
| Corporate expansions & relocations | Build-to-suit & pre-lease targets | Development leasing |

**Management · brokerage**

| Signal | What it surfaces | Feeds |
| --- | --- | --- |
| Ownership change, out-of-state buyer, portfolio acquisition | New owners with no local operator | New assignment origination |
| Distress filings, receiverships | Assets that need a manager now | Receivership pipeline |
| Lease expirations across the managed portfolio | Renewals to protect before they lapse | Retention — NOI protection |

**Sourced from:** county & assessor records · zoning & planning agendas · building
permits · deed & loan records · recorded comps · court & distress filings ·
firmographics.

---

## Positioning & voice

- First person singular ("I"), personal brand — not agency "we."
- Confident, specific, contrarian. Editorial rhythm; end on a snap.
- Signals over spray. Human-gated over autonomous. *"No signal, no send."*
- Ownership hand-off: *"I own the orchestration. Your team owns the output."*
- Value framing: *"One assignment this surfaces covers a year of the system."*

## Design system (Tolon)

- **Palette:** warm cream gradient canvas (`#F3F1F0 → #F0ECE6 → #ECE3D5`), pure
  black `#000000` text, muted `#8A857E`. No accent hues — contrast does the work.
  One or two full-bleed black bands per page for emphasis.
- **Type:** Manrope (headings, 700–800), Lato (body, 400/700). No decorative serif.
- **Form:** sharp corners, hairline rules, no drop shadows, generous whitespace,
  `Tolon.` wordmark with the period.
- Source of truth for tokens: the `tolon-theme` repo (Ollie + Tolon child theme).

---

## Adapting per prospect

Copy `templates/` into a new `examples/<prospect>/` folder and swap:

- [ ] **Prospect name** — "Capital Asset Management" / "CAM" and "prepared for …".
- [ ] **Market** — "Phoenix Metro" in the report meta and the hero/lede.
- [ ] **Footprint** — the "five-state footprint" phrasing in the Growth System hero.
- [ ] **Vertical focus** — the report is industrial-led (4 industrial + 2 minority
      upsell rows). Re-weight rows to the prospect's target vertical; keep one or
      two off-vertical rows as the visible upsell.
- [ ] **Signals** — replace the ~6 sample rows with realistic, market-specific
      signals (keep them illustrative and labeled as sample until live data exists).
- [ ] **Featured opportunity** — the page-2 brief must be the top signal in the
      focus vertical, with its one-pager / email / call-script previews.
- [ ] **Contacts** — the `[owner resolving]` stubs; fill once the Owner Resolver
      has located the decision-maker.
- [ ] **Pilot line** — "a four-week Phoenix industrial pilot" → the new market.

Then run `node build.mjs examples/<prospect>` to produce the PDFs.

### Layout guardrails

- Growth System must stay **one** US Letter page; the Signal Report is **two**.
- Each `.page` is sized to fit within 11in — if you add rows/content, tighten the
  spacing so it doesn't spill (the build reports page counts so you'll see it).
- The mobile breakpoint is `max-width:720px` on purpose — US Letter is 816px wide,
  so a higher breakpoint would trigger the stacked mobile layout when printing.
