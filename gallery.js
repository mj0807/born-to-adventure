/* Full gallery: builds tiles from GALLERY (gallery-data.js). All clips are muted. */
const grid = document.getElementById("full-grid");
const chips = document.querySelectorAll(".chip");
const lb = document.getElementById("lightbox");
const lbVideo = lb.querySelector(".lightbox-video");
const lbCaption = lb.querySelector(".lightbox-caption");
let visible = GALLERY.slice();
let current = 0;

const fmt = s => `0:${String(Math.round(s)).padStart(2, "0")}`;

function render(filter) {
  visible = filter === "all" ? GALLERY.slice() : GALLERY.filter(c => c.cat === filter);
  grid.innerHTML = "";
  visible.forEach((c, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "clip";
    btn.innerHTML = `
      <img src="videos/gallery/${c.id}.jpg" alt="${c.title}" loading="lazy">
      <span class="clip-time">${fmt(c.dur)}</span>
      <span class="clip-play" aria-hidden="true">▶</span>
      <span class="clip-title">${c.title}</span>`;
    btn.addEventListener("click", () => open(i));
    // Desktop: preview on hover (muted). Phones skip this to save data.
    btn.addEventListener("mouseenter", () => {
      if (!matchMedia("(hover: hover)").matches) return;
      let v = btn.querySelector("video");
      if (!v) {
        v = document.createElement("video");
        Object.assign(v, { muted: true, loop: true, playsInline: true, src: `videos/gallery/${c.id}.mp4` });
        btn.prepend(v);
      }
      v.play().catch(() => {});
    });
    btn.addEventListener("mouseleave", () => btn.querySelector("video")?.pause());
    grid.appendChild(btn);
  });
}

function counts() {
  chips.forEach(ch => {
    const f = ch.dataset.filter;
    ch.querySelector("span").textContent = f === "all" ? GALLERY.length : GALLERY.filter(c => c.cat === f).length;
  });
}

chips.forEach(ch => ch.addEventListener("click", () => {
  chips.forEach(c => { c.classList.toggle("active", c === ch); c.setAttribute("aria-selected", c === ch); });
  render(ch.dataset.filter);
}));

function open(i) {
  current = (i + visible.length) % visible.length;
  const c = visible[current];
  lbVideo.src = `videos/gallery/${c.id}.mp4`;
  lbVideo.poster = `videos/gallery/${c.id}.jpg`;
  lbVideo.muted = true;
  lbVideo.play().catch(() => {});
  lbCaption.textContent = `${c.title} · ${current + 1} / ${visible.length}`;
  lb.hidden = false;
  document.body.style.overflow = "hidden";
}
function close() {
  lbVideo.pause();
  lbVideo.removeAttribute("src");
  lbVideo.load();
  lb.hidden = true;
  document.body.style.overflow = "";
}
lb.querySelector(".prev").addEventListener("click", e => { e.stopPropagation(); open(current - 1); });
lb.querySelector(".next").addEventListener("click", e => { e.stopPropagation(); open(current + 1); });
lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("lightbox-close")) close(); });
document.addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowLeft") open(current - 1);
  if (e.key === "ArrowRight") open(current + 1);
});
// Swipe left/right on phones
let x0 = null;
lb.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", e => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 50) open(current + (dx < 0 ? 1 : -1));
  x0 = null;
});

/* Mobile menu */
const menu = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav nav");
menu?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("mobile-open");
  menu.setAttribute("aria-expanded", isOpen);
  menu.textContent = isOpen ? "✕" : "☰";
});

document.getElementById("year").textContent = new Date().getFullYear();
counts();
render("all");
