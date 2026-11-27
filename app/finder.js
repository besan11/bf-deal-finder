// DealBeacon's renderer and filters: reads the deals, draws the cards,
// and answers every control on the page (search, category, store,
// minimum discount, sort). Filter state also lives in the URL query
// string, so a filtered view is a link you can share and reload.

import { DEALS, COMPARE, CATEGORIES, STORES, CHECKED_DAY } from "./deals.js";
import { discountPercent, dollarsSaved, verdictFor, dealScore, sortDeals, formatPrice } from "./verdict.js";

const grid = document.getElementById("deal-grid");
const countLine = document.getElementById("result-count");
const searchBox = document.getElementById("search");
const categoryRow = document.getElementById("category-chips");
const storeSelect = document.getElementById("store-filter");
const discountSelect = document.getElementById("discount-filter");
const sortSelect = document.getElementById("sort-select");

function readState() {
  const params = new URLSearchParams(location.search);
  return {
    q: params.get("q") || "",
    category: params.get("cat") || "All",
    store: params.get("store") || "All",
    minDiscount: Number(params.get("min") || 0),
    sort: params.get("sort") || "score",
  };
}

function applyFilters(state) {
  const needle = state.q.trim().toLowerCase();
  return DEALS.filter((deal) => {
    if (state.category !== "All" && deal.category !== state.category) return false;
    if (state.store !== "All" && deal.store !== state.store) return false;
    if (discountPercent(deal) < state.minDiscount) return false;
    if (needle && !`${deal.name} ${deal.store} ${deal.category}`.toLowerCase().includes(needle)) return false;
    return true;
  });
}

function dealCard(deal) {
  const pct = discountPercent(deal);
  const verdict = verdictFor(deal);
  const card = document.createElement("article");
  card.className = "deal-card";
  card.innerHTML = `
    <div class="card-top">
      <span class="category">${deal.category}</span>
      <span class="verdict verdict-${verdict.tone}">${verdict.label}</span>
    </div>
    <h3>${deal.name}</h3>
    <p class="store-line"><span class="store">${deal.store}</span> · <span class="checked">Checked ${CHECKED_DAY}</span></p>
    <p class="prices">
      <span class="sale">${formatPrice(deal.sale)}</span>
      <span class="was">${formatPrice(deal.was)}</span>
      <span class="pct">-${pct}%</span>
    </p>
    <p class="save-line">You save ${formatPrice(dollarsSaved(deal))} · Deal score ${dealScore(deal)}</p>
    <p class="evidence">${deal.note}</p>
    <p class="source">Source: ${deal.source}</p>
    <a class="buy-link" href="${deal.url}" target="_blank" rel="noopener">View at ${deal.store} &rarr;</a>`;
  return card;
}

function renderCompare() {
  const body = document.getElementById("compare-body");
  for (const row of COMPARE) {
    const tr = document.createElement("tr");
    const winner = row.aPrice < row.bPrice ? row.aStore : row.aPrice > row.bPrice ? row.bStore : "Tie";
    tr.innerHTML = `
      <td>${row.product}</td>
      <td>${row.aStore} · ${formatPrice(row.aPrice)}</td>
      <td>${row.bStore} · ${formatPrice(row.bPrice)}</td>
      <td><strong>${winner}</strong> — ${row.verdict}</td>`;
    body.appendChild(tr);
  }
}

function renderStats() {
  const totalSaved = DEALS.reduce((sum, deal) => sum + dollarsSaved(deal), 0);
  const biggest = DEALS.reduce((best, deal) => (discountPercent(deal) > discountPercent(best) ? deal : best), DEALS[0]);
  const lows = DEALS.filter((deal) => deal.low).length;
  document.getElementById("stat-deals").textContent = String(DEALS.length);
  document.getElementById("stat-saved").textContent = formatPrice(totalSaved);
  document.getElementById("stat-biggest").textContent = `-${discountPercent(biggest)}%`;
  document.getElementById("stat-biggest-name").textContent = biggest.name;
  document.getElementById("stat-lows").textContent = String(lows);
}

function renderChips(state) {
  for (const category of CATEGORIES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip" + (state.category === category ? " active" : "");
    button.textContent = category;
    button.setAttribute("aria-pressed", state.category === category ? "true" : "false");
    button.addEventListener("click", () => updateState({ category }));
    categoryRow.appendChild(button);
  }
}

function renderStoreOptions(state) {
  for (const store of STORES) {
    const option = document.createElement("option");
    option.value = store;
    option.textContent = store === "All" ? "All stores" : store;
    if (state.store === store) option.selected = true;
    storeSelect.appendChild(option);
  }
}

function render(state) {
  const matches = sortDeals(applyFilters(state), state.sort);
  grid.replaceChildren(...matches.map(dealCard));
  countLine.textContent =
    matches.length === DEALS.length
      ? `Showing all ${matches.length} deals, best first`
      : `Showing ${matches.length} of ${DEALS.length} deals`;
  searchBox.value = state.q;
  discountSelect.value = String(state.minDiscount);
  sortSelect.value = state.sort;
}

function updateState(patch) {
  const params = new URLSearchParams(location.search);
  const next = { ...readState(), ...patch };
  const setParam = (key, value, fallback) => {
    if (value === fallback || value === "") params.delete(key);
    else params.set(key, String(value));
  };
  setParam("q", next.q, "");
  setParam("cat", next.category, "All");
  setParam("store", next.store, "All");
  setParam("min", next.minDiscount, 0);
  setParam("sort", next.sort, "score");
  history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
  render(next);
}

searchBox.addEventListener("input", () => updateState({ q: searchBox.value }));
storeSelect.addEventListener("change", () => updateState({ store: storeSelect.value }));
discountSelect.addEventListener("change", () => updateState({ minDiscount: Number(discountSelect.value) }));
sortSelect.addEventListener("change", () => updateState({ sort: sortSelect.value }));

const initial = readState();
renderChips(initial);
renderStoreOptions(initial);
renderStats();
renderCompare();
render(initial);

// Deep-link to a section: ?view=compare jumps straight to the
// same-product-two-stores table after the page has rendered.
if (new URLSearchParams(location.search).get("view") === "compare") {
  document.getElementById("compare").scrollIntoView();
}
