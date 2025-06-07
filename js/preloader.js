window.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("preloaderShown")) {
    // Skip preloader
    window.partialsReady = false;
    document.body.classList.add("loaded");
    return;
  }

  fetch("preloader.html")
    .then(res => res.text())
    .then(html => {
      const wrapper = document.createElement("div");
      wrapper.id = "preloader-wrapper";
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);

      // ⬇️ RANDOM SPLASH TEXT INSERTION
      const splashTexts = [
        "Mystic-Devloper is kinda cool, right?",
        "C++ was created by Bjarne Stroustrup and,\nits development began in 1979.",
        "Python was created by Guido van Rossum and,\nit was first released on 1991.",
        "Coding is tiring!",
        "Mathematics is beautiful.",
        "(a+b)² = a² + 2ab + b².",
        "Are you a coder?",
        "Aha, fellow Maths & CS lover!",
        "Maths and Computer Science are the best!!",
        "Follow me on my socials!",
        "Did you read Games and Numbers?\nIts is so much fun!",
        "print(\"Hello, World!\")",
        "std::cout << (\"Why C++ is so hard?\");",
        "It is never about the destination,\nAll that matters is journey.",
        "(a + b)(a - b) = a² - b²"
      ];

      const splashTextElement = document.getElementById("splash-text");
      if (splashTextElement) {
        const randomText = splashTexts[Math.floor(Math.random() * splashTexts.length)];
        splashTextElement.textContent = randomText;
      }

      // ✅ Save session flag
      sessionStorage.setItem("preloaderShown", "true");

      // Track when preloader was shown
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
