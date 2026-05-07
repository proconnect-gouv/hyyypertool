//

// Theme init — synchronous, runs before first paint to prevent FOUC
const saved = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (saved === "dark" || (!saved && prefersDark)) {
  document.documentElement.classList.add("dark");
}

document.addEventListener("DOMContentLoaded", () => {
  const isDark = document.documentElement.classList.contains("dark");

  const thumb = document.querySelector<HTMLElement>(".thumb");
  if (thumb) {
    thumb.textContent = isDark ? "🌙" : "☀️";
  }

  const toggle =
    document.querySelector<HTMLButtonElement>("[data-dark-toggle]");
  toggle?.addEventListener("click", () => {
    const next = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", next ? "dark" : "light");
    const t = toggle.querySelector<HTMLElement>(".thumb");
    if (t) t.textContent = next ? "🌙" : "☀️";
    toggle.style.background = next ? "" : "var(--color-grey-200)";
  });
});
