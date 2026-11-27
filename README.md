# bf-deal-finder

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/besan11/bf-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/besan11/bf-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

DealBeacon — a real Black Friday deal finder. 30 deals from Amazon, Best Buy, Walmart and Costco, each checked at its store on Nov 27, 2026, with sale price, usual price, discount, an honest verdict (NEW LOW / STRONG / GOOD / FAIR), and a link to the product at its store. Search, filter by category, store and minimum discount, sort best-first, and compare the same product across two stores. Static files, no build step, no network requests: the whole first load is a few kilobytes.

## Run it

```sh
node --version  # 22.18 or later
python3 -m http.server 8080 --directory app
# open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## How deals were checked

Every price was read on Nov 27, 2026 from the deals source named on its card (9to5Toys, 9to5Mac, MacRumors, Engadget, GamesRadar, Gizmodo, dealnews, beebulletin, The Gadgeteer, RetailShout, 9to5Google, Product Bible), each naming the store. Discounts are computed from the two prices shown, so the math always adds up. Store links open the store's own search for the exact product. See NOTES.md for the full method, the per-deal evidence, and what we deliberately did not claim.

---

<sub>Entered on [make.fun](https://make.fun/?ref=jpgk45b3&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
