const contact = document.getElementById('contact');
const chevron = document.getElementById('chevron');
const logo = document.getElementById('zanLogo');
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
/* ===============================
   RESPONSIVE HANDLING
================================ */
function handleResize() {
  if (!contact || !menuToggle || !mobileNav) return;

  if (window.innerWidth <= 720) {
    contact.classList.add('hidden');
  } else {
    contact.classList.remove('hidden');
  }

  if (window.innerWidth > 1000) {
    mobileNav.classList.remove('open');
    menuToggle.classList.remove('active');
  }
}
/* ===============================
   MOBILE MENU TOGGLE
================================ */
if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuToggle.classList.toggle("active");

  document.body.classList.toggle("menu-open", isOpen);
});

}
document.querySelectorAll('.toggle-sub').forEach(toggle => {
  toggle.addEventListener('click', e => {
    e.preventDefault();
    toggle.parentElement.classList.toggle('open');
  });
});
/* ===============================
   LOGO CLICK BOUNCE
================================ */
if (logo) {
  logo.style.animationPlayState = 'paused';

  logo.addEventListener('click', () => {
    logo.classList.remove('logo-bounce');
    void logo.offsetWidth;
    logo.classList.add('logo-bounce');
  });
}
/* ===============================
   CHEVRON TOGGLE
================================ */
if (chevron && contact) {
  chevron.addEventListener('click', () => {
    contact.classList.toggle('hidden');
    chevron.classList.toggle('active');
  });
}
/* ===============================
   DOM READY
================================ */
document.addEventListener('DOMContentLoaded', () => {
  handleResize();
  window.addEventListener('resize', handleResize);

  // Auto year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
/* ===============================
   WINDOW LOAD – LOADING SCREEN
================================ */
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;

  const minDisplayTime = 3500;

  setTimeout(() => {
    loadingScreen.style.animation = 'fadeOut 0.5s ease forwards';

    setTimeout(() => {
      loadingScreen.remove();
      if (logo) logo.style.animationPlayState = 'running';
    }, 500);
  }, minDisplayTime);
});
// Footer submenus
  document.querySelectorAll('.submenu-toggle').forEach(toggle => {
    toggle.addEventListener('click', e => {
      e.preventDefault();
      const submenu = toggle.nextElementSibling;
      if (!submenu) return;

      document.querySelectorAll('.submenu').forEach(menu => {
        if (menu !== submenu) menu.style.display = 'none';
      });

      submenu.style.display =
        submenu.style.display === 'block' ? 'none' : 'block';
    });
  });