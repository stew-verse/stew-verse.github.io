document.addEventListener("DOMContentLoaded", function () {
  fetch("navbar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data;

      // Only run this after navbar is loaded
      const links = document.querySelectorAll(".nav-links a");
      const currentPath = window.location.pathname.split("/").pop() || "index.html";

      links.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
          link.classList.add("active");
        }
      });
    });
});

// Add sticky shadow on scroll
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 10) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
