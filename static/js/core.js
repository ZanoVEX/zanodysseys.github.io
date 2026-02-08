/* ===============================
   ELEMENT REFERENCES
================================ */
const contact = document.getElementById('contact');
const chevron = document.getElementById('chevron');
const logo = document.getElementById('zanLogo');
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const loadingScreen = document.getElementById('loading-screen');

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
    document.body.classList.remove('menu-open');
  }
}

/* ===============================
   MOBILE MENU TOGGLE
================================ */
if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('active');
    document.body.classList.toggle('menu-open', isOpen);
  });
}

/* ===============================
   SUBMENU TOGGLES (HEADER)
================================ */
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
    void logo.offsetWidth; // force reflow
    logo.classList.add('logo-bounce');
  });
}

/* ===============================
   CHEVRON CONTACT TOGGLE
================================ */
if (chevron && contact) {
  chevron.addEventListener('click', () => {
    contact.classList.toggle('hidden');
    chevron.classList.toggle('active');
  });
}

/* ===============================
   DOM READY (FAST LOAD)
================================ */
document.addEventListener('DOMContentLoaded', () => {
  handleResize();
  window.addEventListener('resize', handleResize);

  // Auto year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- FAST LOADER HIDE --- */
  if (loadingScreen) {
    loadingScreen.classList.add('hide');

    setTimeout(() => {
      loadingScreen.remove();
      if (logo) logo.style.animationPlayState = 'running';
    }, 500);
  }
});

/* ===============================
   SAFETY NET (MAX 4s LOADER)
================================ */
setTimeout(() => {
  if (loadingScreen) {
    loadingScreen.remove();
    if (logo) logo.style.animationPlayState = 'running';
  }
}, 4000);

/* ===============================
   FOOTER SUBMENUS
================================ */
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