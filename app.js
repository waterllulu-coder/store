const state = {
  data: null,
  tabId: null,
  query: "",
};

const $ = (id) => document.getElementById(id);

function normalize(s) {
  return (s || "").toString().toLowerCase().replace(/\s+/g, " ").trim();
}

function lookSearchText(episode, look) {
  const productText = look.products
    .map((p) => [p.name, p.shop, p.option, p.id, p.priceLabel].join(" "))
    .join(" ");
  return normalize(
    [
      episode.tab,
      episode.title,
      episode.id,
      look.label,
      look.title,
      look.id,
      productText,
    ].join(" ")
  );
}

function matchesQuery(episode, look, q) {
  if (!q) return true;
  return lookSearchText(episode, look).includes(q);
}

function renderTabs(episodes) {
  const nav = $("tabs");
  nav.innerHTML = "";
  episodes.forEach((ep) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tab";
    btn.dataset.id = ep.id;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", ep.id === state.tabId ? "true" : "false");
    btn.textContent = ep.tab;
    btn.addEventListener("click", () => {
      state.tabId = ep.id;
      render();
      nav.querySelectorAll(".tab").forEach((t) => {
        t.setAttribute("aria-selected", t.dataset.id === state.tabId ? "true" : "false");
      });
    });
    nav.appendChild(btn);
  });
}

function productCard(p) {
  const option = p.option
    ? `<p class="product-option">${escapeHtml(p.option)}</p>`
    : "";
  return `
    <a class="product" href="${escapeAttr(p.url)}" target="_blank" rel="noopener noreferrer">
      <div class="product-img">
        <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.shop + " " + p.name)}" loading="lazy">
      </div>
      <div class="product-body">
        <p class="product-shop">${escapeHtml(p.shop)}</p>
        <p class="product-name">${escapeHtml(p.name)}</p>
        ${option}
        <p class="product-price">${escapeHtml(p.priceLabel)}</p>
        <span class="product-cta">보러가기 ›</span>
      </div>
    </a>
  `;
}

function lookCard(look) {
  return `
    <article class="look" id="${escapeAttr(look.id)}">
      <div class="look-head">
        <p class="look-label">${escapeHtml(look.label)}</p>
        <h3 class="look-title">${escapeHtml(look.title)}</h3>
      </div>
      <div class="look-still">
        <img src="${escapeAttr(look.still)}" alt="${escapeAttr(look.label + " 착장")}">
      </div>
      <div class="products">
        ${look.products.map(productCard).join("")}
      </div>
    </article>
  `;
}

function episodeBlock(episode, looks) {
  const dateLabel = episode.date ? episode.date.replaceAll("-", ".") : "";
  const reel = episode.reelUrl
    ? ` · <a href="${escapeAttr(episode.reelUrl)}" target="_blank" rel="noopener noreferrer">영상 보기</a>`
    : "";
  return `
    <section class="episode" id="${escapeAttr(episode.id)}">
      <h2 class="episode-title">${escapeHtml(episode.title)}</h2>
      <p class="episode-meta">${escapeHtml(episode.tab)}${dateLabel ? " · " + dateLabel : ""}${reel}</p>
      ${looks.map(lookCard).join("")}
    </section>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("'", "&#39;");
}

function render() {
  const { data, query } = state;
  const q = normalize(query);
  const main = $("main");
  const empty = $("empty");
  let html = "";
  let shown = 0;

  data.episodes.forEach((episode) => {
    const inSelectedTab = !q && episode.id === state.tabId;
    const searching = Boolean(q);
    if (!inSelectedTab && !searching) return;
    const looks = episode.looks.filter((look) => matchesQuery(episode, look, q));
    if (!looks.length) return;
    html += episodeBlock(episode, looks);
    shown += looks.length;
  });

  main.innerHTML = html;
  empty.hidden = shown > 0;
}

function applyStoreCopy(store) {
  if (store.title) {
    document.title = store.title;
    $("store-title").textContent = store.title;
  }
  if (store.subtitle) $("store-subtitle").textContent = store.subtitle;
  if (store.instagram) {
    const handle = store.instagram.startsWith("@")
      ? store.instagram
      : "@" + store.instagram;
    const a = $("ig-link");
    a.textContent = handle;
    a.href = store.instagramUrl || "https://www.instagram.com/" + store.instagram + "/";
  }
  if (store.disclosure) {
    $("disclosure").textContent = store.disclosure;
    $("footer-disclosure").textContent = store.disclosure;
  }
  if (store.aiNote) {
    $("ai-note").textContent = store.aiNote;
    $("footer-ai").textContent = store.aiNote;
  }
  if (store.priceNote) $("footer-price").textContent = store.priceNote;
}

async function init() {
  const res = await fetch("data.json");
  if (!res.ok) throw new Error("data.json을 불러오지 못했어요");
  const data = await res.json();
  state.data = data;
  state.tabId = data.episodes[0] ? data.episodes[0].id : null;
  applyStoreCopy(data.store || {});
  renderTabs(data.episodes);
  render();

  $("search").addEventListener("input", (e) => {
    state.query = e.target.value;
    render();
  });
}

init().catch((err) => {
  $("empty").hidden = false;
  $("empty").textContent = "페이지를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
  console.error(err);
});
