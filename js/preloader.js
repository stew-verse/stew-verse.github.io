// /js/preloader.js

window.addEventListener("DOMContentLoaded", () => {
  fetch("preloader.html")
    .then(res => res.text())
    .then(html => {
      const wrapper = document.createElement("div");
      wrapper.id = "preloader-wrapper";
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);
    });
});

// Remove preloader only after partials and page are loaded
window.addEventListener("load", () => {
  const tryFinish = () => {
    const wrapper = document.getElementById("preloader-wrapper");
    if (wrapper) {
      wrapper.style.opacity = "0";
      setTimeout(() => {
        wrapper.remove();
        document.body.classList.add("loaded");
      }, 600);
    }
  };

  // Wait for partials
  if (window.partialsReady) {
    tryFinish();
  } else {
    document.addEventListener("partials:loaded", () => {
      tryFinish();
    });
  }
});
