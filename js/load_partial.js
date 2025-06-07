// js/load_partial.js

document.addEventListener("DOMContentLoaded", () => {
  const bodyPartials = document.querySelectorAll("[data-include]:not(template)");
  const headPartials = document.querySelectorAll("template[data-include]");

  // Load body partials (e.g., <div data-include="...">)
  bodyPartials.forEach(el => {
    const url = el.getAttribute("data-include");

    fetch(url)
      .then(res => res.text())
      .then(data => {
        el.innerHTML = data;
        processContent(data);

        // Dispatch navbar event
        if (url.includes("navbar.html")) {
          document.dispatchEvent(new Event("navbar:ready"));
        }
      })
      .catch(err => console.error(`Error loading ${url}:`, err));
  });

  // Load head partials (e.g., <template data-include="...">)
  headPartials.forEach(el => {
    const url = el.getAttribute("data-include");

    fetch(url)
      .then(res => res.text())
      .then(data => {
        const temp = document.createElement("div");
        temp.innerHTML = data;

        // Append each child into <head>
        [...temp.children].forEach(child => document.head.appendChild(child));

        processContent(data);
      })
      .catch(err => console.error(`Error loading ${url}:`, err));
  });

  // Function to process scripts and link tags
  function processContent(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Handle scripts
    temp.querySelectorAll("script").forEach(oldScript => {
      const newScript = document.createElement("script");

      // Copy all attributes
      [...oldScript.attributes].forEach(attr =>
        newScript.setAttribute(attr.name, attr.value)
      );

      // Inline script content
      newScript.textContent = oldScript.textContent;

      // Append to body (executes immediately)
      document.body.appendChild(newScript);
    });

    // Handle stylesheets
    temp.querySelectorAll('link[rel="stylesheet"]').forEach(oldLink => {
      const newLink = document.createElement("link");

      [...oldLink.attributes].forEach(attr =>
        newLink.setAttribute(attr.name, attr.value)
      );

      document.head.appendChild(newLink);
    });
  }
});
