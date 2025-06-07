document.addEventListener("DOMContentLoaded", () => {
  const bodyPartials = document.querySelectorAll("[data-include]:not(template)");
  const headPartials = document.querySelectorAll("template[data-include]");
  const totalPartials = bodyPartials.length + headPartials.length;
  let loadedCount = 0;
  const version = `v=${Date.now()}`;

  bodyPartials.forEach(el => {
    const url = bustCache(el.getAttribute("data-include"));
    loadWithRetry(url, el, false);
  });

  headPartials.forEach(el => {
    const url = bustCache(el.getAttribute("data-include"));
    loadWithRetry(url, el, true);
  });

  // ----------------------
  // Retry Mechanism
  // ----------------------

  function loadWithRetry(url, el, isHead, attempts = 0) {
    fetch(url)
      .then(res => res.text())
      .then(data => {
        if (isHead) {
          const temp = document.createElement("div");
          temp.innerHTML = data;

          [...temp.children].forEach(child => {
            if (child.tagName === "META") {
              const name = child.getAttribute("name");
              const charset = child.getAttribute("charset");
              if (
                (name && document.head.querySelector(`meta[name="${name}"]`)) ||
                (charset && document.head.querySelector(`meta[charset]`))
              ) return;
            }
            document.head.appendChild(child);
          });

        } else {
          el.innerHTML = data;

          if (url.includes("navbar.html")) {
            document.dispatchEvent(new Event("navbar:ready"));
          }
        }

        processContent(data);
        checkIfAllLoaded();
      })
      .catch(err => {
        if (attempts < 2) {
          console.warn(`🔁 Retry ${attempts + 1} for ${url}`);
          setTimeout(() => loadWithRetry(url, el, isHead, attempts + 1), 500);
        } else {
          console.error(`❌ Failed after 3 attempts: ${url}`, err);
          const fallback = fallbackMessage(url);

          if (isHead) {
            const span = document.createElement("span");
            span.innerHTML = fallback;
            document.head.appendChild(span);
          } else {
            el.innerHTML = fallback;
          }

          checkIfAllLoaded();
        }
      });
  }

  // ----------------------
  // Helpers
  // ----------------------

  function bustCache(url) {
    return url.includes("?") ? `${url}&${version}` : `${url}?${version}`;
  }

  function fallbackMessage(url) {
    return `<div style="color:red;font-size:0.9em;">⚠️ Failed to load after 3 tries: ${url}</div>`;
  }

  function checkIfAllLoaded() {
    loadedCount++;
    if (loadedCount === totalPartials) {
      document.dispatchEvent(new Event("partials:loaded"));
    }
  }

  function processContent(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Inject <script>
    temp.querySelectorAll("script").forEach(oldScript => {
      const newScript = document.createElement("script");
      [...oldScript.attributes].forEach(attr =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.textContent = oldScript.textContent;
      document.body.appendChild(newScript);
    });

    // Inject <link rel="stylesheet">
    temp.querySelectorAll('link[rel="stylesheet"]').forEach(oldLink => {
    const newLink = document.createElement("link");
   [...oldLink.attributes].forEach(attr =>
       newLink.setAttribute(attr.name, attr.value)
   );
    newLink.onload = checkIfAllLoaded; // Wait for CSS to load before counting it
    document.head.appendChild(newLink);
   });

   // 🔁 Re-scan new templates added
  const newPartials = temp.querySelectorAll("[data-include]");
  newPartials.forEach(partial => {
    const url = bustCache(partial.getAttribute("data-include"));
    const isHead = partial.tagName === "TEMPLATE" || partial.closest("head");
    loadWithRetry(url, partial, isHead);
  });
  }
});
