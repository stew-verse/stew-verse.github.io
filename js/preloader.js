window.addEventListener("DOMContentLoaded", () => {
  fetch("preloader.html")
    .then(res => res.text())
    .then(html => {
      const wrapper = document.createElement("div");
      wrapper.id = "preloader-wrapper";
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);

      // Track when preloader was shown
      window._preloaderStart = performance.now();
    });
});

window.addEventListener("load", () => {
  const tryFinish = () => {
    const wrapper = document.getElementById("preloader-wrapper");
    if (!wrapper) return;

    const elapsed = performance.now() - (window._preloaderStart || 0);
    const wait = Math.max(0, 1000 - elapsed); // Wait if less than 1s

    setTimeout(() => {
      wrapper.style.opacity = "0";
      wrapper.style.transition = "opacity 0.6s ease";
      setTimeout(() => {
        wrapper.remove();
        document.body.classList.add("loaded");
      }, 600);
    }, wait);
  };

  if (window.partialsReady) {
    tryFinish();
  } else {
    document.addEventListener("partials:loaded", tryFinish);
  }
});
