// js/navbar.js

// Navbar link setup
document.addEventListener("navbar:ready", () => {
  const links = document.querySelectorAll(".nav-links a");
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  links.forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
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
