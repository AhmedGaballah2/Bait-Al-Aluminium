/* Admin Dashboard Sidebar Navigation */

document.addEventListener("DOMContentLoaded", function () {
  // Set active nav item based on current URL
  const navLinks = document.querySelectorAll("#nav-sidebar a");
  const currentPath = window.location.pathname;

  navLinks.forEach((link) => {
    if (link.href.includes(currentPath)) {
      link.classList.add("current");
      link.style.borderRightColor = "#f9a825";
      link.style.backgroundColor = "rgba(249, 168, 37, 0.1)";
    }
  });

  // Add click handlers for smooth navigation
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.forEach((l) => {
        l.classList.remove("current");
        l.style.borderRightColor = "transparent";
        l.style.backgroundColor = "";
      });
      this.classList.add("current");
      this.style.borderRightColor = "#f9a825";
      this.style.backgroundColor = "rgba(249, 168, 37, 0.1)";
    });
  });

  // Make sidebar sticky on scroll
  const sidebar = document.getElementById("nav-sidebar");
  if (sidebar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 120) {
        sidebar.style.position = "sticky";
        sidebar.style.top = "0";
      }
    });
  }
});

// Search functionality enhancement
function enhanceSearch() {
  const searchInput = document.querySelector('.search input[type="text"]');
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const value = this.value.toLowerCase();
      const cards = document.querySelectorAll('[style*="background: white"]');

      cards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        if (text.includes(value)) {
          card.style.display = "grid";
        } else {
          card.style.display = "none";
        }
      });
    });
  }
}

// Initialize on load
window.addEventListener("load", enhanceSearch);
