// js/load_partial.js

document.addEventListener("DOMContentLoaded", () => {
  const partials = document.querySelectorAll("[data-include]");

  partials.forEach(el => {
    const url = el.getAttribute("data-include");

    fetch(url)
      .then(res => res.text())
      .then(data => {
        el.innerHTML = data;

        // Dispatch custom event if navbar is loaded
        if (url.includes("navbar.html")) {
          document.dispatchEvent(new Event("navbar:ready"));
        }
      })
      .catch(err => console.error(`Error loading ${url}:`, err));
  });
});
