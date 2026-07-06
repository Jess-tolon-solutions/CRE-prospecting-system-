# Starter prompt — new prospect

Paste this into a new session and fill the brackets. Only the website is required;
leave the market/focus out and they'll be inferred from the site.

```
Load the CRE Prospecting System repo:
https://github.com/Jess-tolon-solutions/CRE-prospecting-system-.git

New prospect: [company website URL]
(optional) Lead market: [e.g. Denver Metro]   Property focus: [e.g. office]

Create both pages (Growth System + Monday Signal Report) tailored to them:
research the site for the company name / services / language / footprint, infer
the lead market and property focus if I didn't give them, fill the config,
generate the HTML + PDFs + previews, and replace the sample signal rows and
featured brief with realistic signals in their market and vertical (labeled
illustrative, using that market's regulatory vocabulary). Show me the previews,
then push the new prospect folder.
```

## What happens

1. **Research** the site — company name, services, the language they use, footprint.
2. **Infer** the lead market and property focus if not supplied (stated back to you
   before generating, so you can flip it — useful right before a live call).
3. **Config** → `prospects/<slug>.json` (company, market, focus, footprint).
4. **Generate** → `node new-prospect.mjs …` writes `examples/<slug>/` with HTML,
   print-ready PDFs, and PNG previews.
5. **Tailor** the six signal rows + featured brief to that market (real submarkets,
   the market's own zoning/entitlement vocabulary), kept **illustrative**.
6. **Review** the previews, then commit + push the new prospect folder.

## The one judgment call

The framing is fully automated and correct. The **signal rows are illustrative**
until a real data pull backs them — they're drafted to read bespoke for the market,
and the doc says so in its own disclaimer. Verify the specifics before sending.
