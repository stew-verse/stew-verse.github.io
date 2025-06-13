document.addEventListener('DOMContentLoaded', function() {
  // Add sticky shadow on scroll
  const navbar = document.querySelector(".main-nav"); // Selector updated to .main-nav from .navbar
  if (navbar) { // Ensure the navbar element exists before adding event listener
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  // Navbar active link setup
  const links = document.querySelectorAll(".nav-collapse ul a"); // Selector updated to .nav-collapse ul a from .nav-links a
  const currentPath = window.location.pathname.split("/").pop() || "index.html"; // Gets the last segment of the URL (e.g., "about" from "/about/") or "index.html" for the root.

  links.forEach(link => {
    // Extract the last part of the link's href for comparison (e.g., "about" from "/about/")
    const linkPath = link.getAttribute("href").split("/").pop();

    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });
});
