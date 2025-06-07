document.addEventListener("DOMContentLoaded", () => {
  const bodyPartials = document.querySelectorAll("[data-include]:not(template)");
  const headPartials = document.querySelectorAll("template[data-include]");
  const totalPartials = bodyPartials.length + headPartials.length;
  let loadedCount = 0;
  const version = `v=${Date.now()}`; // Cache-busting

  bodyPartials.forEach(el => {
    const url = bustCache(el.getAttribute("data-include"));

    fetch(url)
      .then(res => res.text())
      .then(data => {
        el.innerHTML = data;
        processContent(data);

        if (url.includes("navbar.html")) {
          document.dispatchEvent(new Event("navbar:ready"));
        }

        checkIfAllLoaded();
      })
      .catch(err => {
        console.error(`❌ Error loading ${url}:`, err);
        el.innerHTML = fallbackMessage(url);
        checkIfAllLoaded();
      });
  });

  headPartials.forEach(el => {
    const url = bustCache(el.getAttribute("data-include"));

    fetch(url)
      .then(res => res.text())
      .then(data => {
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

        processContent(data);
        checkIfAllLoaded();
      })
      .catch(err => {
        console.error(`❌ Error loading ${url}:`, err);
        const span = document.createElement("span");
        span.innerHTML = fallbackMessage(url);
        document.head.appendChild(span);
        checkIfAllLoaded();
      });
  });

  function bustCache(url) {
    return url.includes("?") ? `${url}&${version}` : `${url}?${version}`;
  }

  function fallbackMessage(url) {
    return `<div style="color:red;font-size:0.9em;">⚠️ Failed to load: ${url}</div>`;
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

    // Scripts
    temp.querySelectorAll("script").forEach(oldScript => {
      const newScript = document.createElement("script");
      [...oldScript.attributes].forEach(attr =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.textContent = oldScript.textContent;
      document.body.appendChild(newScript);
    });

    // Stylesheets
    temp.querySelectorAll('link[rel="stylesheet"]').forEach(oldLink => {
      const newLink = document.createElement("link");
      [...oldLink.attributes].forEach(attr =>
        newLink.setAttribute(attr.name, attr.value)
      );
      document.head.appendChild(newLink);
    });
  }
});
