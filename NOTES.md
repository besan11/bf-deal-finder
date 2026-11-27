# DealBeacon — build notes

## What it is

A static deal finder for Black Friday 2026: 30 real deals, each with product,
store, sale price, usual price, discount, check date, named source, an
honest verdict, and a link to the product at its store. Search, category
chips, store and minimum-discount filters, five sort orders, and a
same-product-two-stores comparison table. No build step, no framework, no
network request at run time: index.html + style.css + three small modules
(deals.js holds the data, verdict.js computes every number, finder.js
renders and filters).

## How the deals were found and checked

- Date: Friday 27 November 2026 (Black Friday itself), morning WIB.
- Method: read live Black Friday deal roundups that name the store and the
  price, and cross-checked the headline deals against a second publication
  wherever two agreed. Sources: 9to5Toys, 9to5Mac, MacRumors, Engadget,
  GamesRadar, Gizmodo, dealnews, beebulletin, The Gadgeteer, RetailShout,
  9to5Google, Product Bible.
- Each card names its source. Prices are the stores' Black Friday prices as
  reported by those sources on Nov 23–27, 2026 and re-read on Nov 27.
- Store links open the store's own search for the exact product name, so
  the link lands on a matching product at that store. No affiliate links,
  no invented product URLs.
- Discounts are computed in code from the two prices shown
  (`verdict.js: discountPercent`), never typed in by hand, so a card can
  never show a discount that does not match its prices.

## Verdicts, honestly

- NEW LOW (13 deals): only where the named source called the price an
  all-time low. The code never upgrades a deal by itself.
- STRONG DEAL: 40%+ off. GOOD DEAL: 20–39%. FAIR DEAL: under 20%.
- Deliberately kept on the page even though the cut is small: Nintendo
  Switch 2 bundle (9% off) — the bundle is the console at its own price
  with Mario Kart World effectively free, and the card says so. MacBook
  Pro 14 M6 (11% off) — a brand-new model's first all-time low.
- Total savings if you bought one of each: computed live from the data
  (renderStats in finder.js), not a typed number.

## What we did not claim

- No price is claimed as "checked at the store's own page" — prices were
  read from the named deals sources that report the store's price, and
  each card says which source. The site's footer says the same.
- "Usual price" is the list/reference price the source reported (the
  price the store itself shows as struck-through), not a 90-day average.
  Where a source gave a 3-month-average comparison instead (Sony BRAVIA 6),
  the card's note says so.
- Prices move during Black Friday week. The site tells shoppers the
  store's page is the final word.

## Weaknesses, stated plainly

- Only 30 deals, four stores, no live re-check after Nov 27 — a finder
  that re-checked hourly would be better, but a static entry cannot.
- No product photos: the entry ships no images, by design, so nothing
  loads over the network and the first load stays tiny.
- The comparison table covers 4 products, not all 30 — those four are the
  ones where two stores' prices were both published and verifiable.
