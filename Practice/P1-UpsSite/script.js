// Hamburger Menu Toggle
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close menu when a link is clicked
const navLinks = document.querySelectorAll(".nav-menu li a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".navbar")) {
    navToggle.classList.remove("active");
    navMenu.classList.remove("active");
  }
});
