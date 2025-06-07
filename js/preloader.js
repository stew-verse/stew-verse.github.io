window.addEventListener("DOMContentLoaded", () => {
  fetch("/partials/core/preloader.html")
    .then(res => res.text())
    .then(html => {
      const wrapper = document.createElement("div");
      wrapper.id = "preloader-wrapper";
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);

      // Re-execute embedded <script> (for splash text logic)
      const temp = document.createElement("div");
      temp.innerHTML = html;

      temp.querySelectorAll("script").forEach(oldScript => {
        const newScript = document.createElement("script");
        [...oldScript.attributes].forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = oldScript.textContent;
        document.body.appendChild(newScript);
      });

      window._preloaderStart = performance.now();
    });
});

window.addEventListener("load", () => {
  const tryFinish = () => {
    const wrapper = document.getElementById("preloader-wrapper");
    if (!wrapper) return;

    const elapsed = performance.now() - (window._preloaderStart || 0);
    const wait = Math.max(0, 1000 - elapsed);

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
