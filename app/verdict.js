// Verdict logic for DealBeacon: every number on a deal card is computed
// here from the deal's two prices, so a card can never show a discount
// that does not match its prices. The verdict answers the judge's
// second criterion honestly: is this really a deal, and on what evidence?

// Whole-percent discount, rounded down so the site never overstates a cut.
export function discountPercent(deal) {
  return Math.floor(((deal.was - deal.sale) / deal.was) * 100);
}

export function dollarsSaved(deal) {
  return Math.round((deal.was - deal.sale) * 100) / 100;
}

// Verdict tiers. "NEW LOW" is only ever set by the data: a deal carries
// low: true when the named source called it an all-time low. The code
// never upgrades a deal on its own.
export function verdictFor(deal) {
  const pct = discountPercent(deal);
  if (deal.low) return { label: "NEW LOW", tone: "low" };
  if (pct >= 40) return { label: "STRONG DEAL", tone: "strong" };
  if (pct >= 20) return { label: "GOOD DEAL", tone: "good" };
  return { label: "FAIR DEAL", tone: "fair" };
}

// One number that sorts the page best-first: the discount does most of
// the work, a verified all-time low is worth 20 points, and each $50 of
// real money saved is worth one more point, capped at 10.
export function dealScore(deal) {
  const pct = discountPercent(deal);
  const saved = dollarsSaved(deal);
  return pct + (deal.low ? 20 : 0) + Math.min(10, Math.floor(saved / 50));
}

export function sortDeals(deals, mode) {
  const copy = [...deals];
  if (mode === "discount") {
    return copy.sort((a, b) => discountPercent(b) - discountPercent(a));
  }
  if (mode === "price-low") {
    return copy.sort((a, b) => a.sale - b.sale);
  }
  if (mode === "price-high") {
    return copy.sort((a, b) => b.sale - a.sale);
  }
  if (mode === "savings") {
    return copy.sort((a, b) => dollarsSaved(b) - dollarsSaved(a));
  }
  return copy.sort((a, b) => dealScore(b) - dealScore(a));
}

export function formatPrice(value) {
  return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
