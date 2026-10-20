/* ---------- Mobile menu ---------- */
const menu = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav nav");
menu?.addEventListener("click", () => {
  const open = nav.classList.toggle("mobile-open");
  menu.setAttribute("aria-expanded", open);
  menu.textContent = open ? "✕" : "☰";
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("mobile-open");
  menu.setAttribute("aria-expanded", "false");
  menu.textContent = "☰";
}));

/* ---------- Videos: muted, play only while on screen ---------- */
const clips = document.querySelectorAll("video[preload='none']");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) { v.muted = true; v.play().catch(() => {}); }
      else v.pause();
    });
  }, { threshold: 0.25 });
  clips.forEach(v => io.observe(v));
}

/* ---------- Lightbox (gallery clips, full screen) ---------- */
const lb = document.getElementById("lightbox");
const lbVideo = lb.querySelector(".lightbox-video");
function openLightbox(src, caption) {
  lbVideo.src = src;
  lbVideo.muted = true;
  lbVideo.play().catch(() => {});
  lb.querySelector(".lightbox-caption").textContent = caption || "";
  lb.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lbVideo.pause();
  lbVideo.removeAttribute("src");
  lbVideo.load();
  lb.hidden = true;
  document.body.style.overflow = "";
}
document.querySelectorAll(".gallery-item[data-video]").forEach(btn =>
  btn.addEventListener("click", () => openLightbox(btn.dataset.video, btn.querySelector("span")?.textContent))
);
lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("lightbox-close")) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !lb.hidden) closeLightbox(); });

/* ---------- WhatsApp booking form ---------- */
const form = document.getElementById("booking-form");
const today = new Date().toISOString().split("T")[0];
form.date.min = today;
form.addEventListener("submit", e => {
  e.preventDefault();
  const f = form.elements;
  const lines = [
    "Hi Born to Adventure! I'd like to book.",
    `Name: ${f.name.value}`,
    `Activity: ${f.activity.value}`,
    f.date.value ? `Date: ${new Date(f.date.value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : "",
    `Guests: ${f.guests.value}`,
    f.notes.value ? `Notes: ${f.notes.value}` : "",
    "Please share availability and booking details."
  ].filter(Boolean);
  window.open(`https://wa.me/918219050387?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
});

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
