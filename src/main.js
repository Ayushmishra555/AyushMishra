import "./style.css";
import { ME, PROJECTS } from "./data.js";

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- Content ---------- */
document.title = `${ME.name} – ${ME.roles[0]}`;
$("brand").innerHTML = `${esc(ME.name.split(" ")[0])}<span>.</span>`;
$("status").textContent = ME.status;
$("name").textContent = ME.name;
$("tagline").textContent = ME.tagline;
$("bio").innerHTML = ME.bio.map((p) => `<p>${esc(p)}</p>`).join("");
$("skills").innerHTML = ME.skills.map((s) => `<span class="chip">${esc(s)}</span>`).join("");
$("stats").innerHTML = ME.stats.map(([n, l]) => `<div><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join("");
$("socials").innerHTML = ME.socials
  .map(([n, u], i) => `<a class="btn ${i === 0 ? "primary" : "ghost"}" target="_blank" rel="noopener" href="${esc(u)}">${esc(n)}</a>`)
  .join("");
$("foot").textContent = `© ${new Date().getFullYear()} ${ME.name}.`;

/* ---------- Typing effect ---------- */
(function typing() {
  const el = $("typed");
  let r = 0, i = 0, del = false;
  const tick = () => {
    const word = ME.roles[r];
    el.textContent = word.slice(0, i);
    if (!del && i === word.length) { del = true; return setTimeout(tick, 1400); }
    if (del && i === 0) { del = false; r = (r + 1) % ME.roles.length; }
    i += del ? -1 : 1;
    setTimeout(tick, del ? 40 : 80);
  };
  tick();
})();

/* ---------- Projects: gradient thumbnails + filter ---------- */
const palettes = [["#d9a58a", "#eccdb9"], ["#b2c09a", "#dde5cc"], ["#e3c98f", "#f2e4bd"], ["#c9a9a0", "#e8d4cc"]];
const thumb = (i, title) => {
  const [a, b] = palettes[i % palettes.length];
  return `<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="t${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
  <rect width="400" height="200" fill="url(#t${i})"/><g fill="#fff" fill-opacity=".32"><circle cx="330" cy="40" r="70"/><circle cx="60" cy="190" r="60"/><rect x="150" y="60" width="110" height="80" rx="12"/></g>
  <text x="200" y="112" text-anchor="middle" font-family="Fraunces,serif" font-weight="700" font-size="26" fill="#4a3f35">${esc(title)}</text></svg>`;
};
let cat = "All";
function renderProjects() {
  const cats = ["All", ...new Set(PROJECTS.map((p) => p.cat))];
  $("filters").innerHTML = cats.map((c) => `<button data-c="${esc(c)}" class="${c === cat ? "on" : ""}">${esc(c)}</button>`).join("");
  $("cards").innerHTML = PROJECTS.map((p, i) => ({ p, i }))
    .filter(({ p }) => cat === "All" || p.cat === cat)
    .map(({ p, i }) => `<article class="card tilt">
      <div class="thumb">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)} preview" loading="lazy">` : thumb(i, p.title)}</div>
      <div class="body"><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p>
      <div class="chips">${p.tech.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
      <div class="links2"><a target="_blank" rel="noopener" href="${esc(p.live)}">Live demo ↗</a><a target="_blank" rel="noopener" href="${esc(p.code)}">Source ↗</a></div></div></article>`)
    .join("");
}
$("filters").addEventListener("click", (e) => { if (e.target.dataset.c) { cat = e.target.dataset.c; renderProjects(); } });
renderProjects();

/* 3D tilt on cards (desktop) */
$("cards").addEventListener("pointermove", (e) => {
  if (e.pointerType !== "mouse") return;
  const c = e.target.closest(".tilt"); if (!c) return;
  const r = c.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
  c.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
});
$("cards").addEventListener("pointerout", (e) => { const c = e.target.closest(".tilt"); if (c) c.style.transform = ""; });

/* ---------- Scroll reveal + nav ---------- */
const io = new IntersectionObserver((es) => es.forEach((en) => en.isIntersecting && (en.target.classList.add("in"), io.unobserve(en.target))), { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
addEventListener("scroll", () => $("nav").classList.toggle("scrolled", scrollY > 20), { passive: true });

