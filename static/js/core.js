const NAV_BREAKPOINT = 1000;

const menuDetails = {
  home: {
    kicker: "Start Here",
    summary: "Begin with Zanzibar inspiration, signature moments, and easy planning."
  },
  destinations: {
    kicker: "Places",
    summary: "Stone Town, ocean escapes, and mainland horizons in one seamless route."
  },
  services: {
    kicker: "Travel Design",
    summary: "Transfers, stays, safaris, and guided experiences shaped around you."
  },
  about: {
    kicker: "Our Story",
    summary: "Meet the local team behind the calm, personal ZanOdysseys touch."
  },
  contact: {
    kicker: "Concierge",
    summary: "Share your dates and style, then let us shape the right journey."
  },
  search: {
    kicker: "Quick Find",
    summary: "Jump straight to the destination, stay, or experience you have in mind."
  }
};

let topbar = null;
let contact = null;
let chevron = null;
let logo = null;
let menuToggle = null;
let mobileNav = null;
let mobileNavBackdrop = null;

function getSectionKey(label = "") {
  return String(label)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function normalizePath(value = "") {
  if (!value) {
    value = window.location.pathname || "/";
  }
  if (/^(mailto:|tel:|javascript:|data:)/i.test(value)) return "";

  try {
    value = new URL(value, window.location.href).pathname || "/";
  } catch {
    value = value.split(/[?#]/)[0] || "/";
  }

  value = value.replace(/index\.html$/i, "");
  value = value.replace(/\/{2,}/g, "/");

  if (value.length > 1) {
    value = value.replace(/\/+$/, "");
  }

  return value || "/";
}

function isPathWithin(currentPath, targetPath, exact = false) {
  if (!targetPath) return false;
  if (exact) return currentPath === targetPath;
  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}

function findMenuItem(menuData, label = "") {
  const key = getSectionKey(label);
  return menuData.find(item => getSectionKey(item.label) === key) || null;
}

function findMenuChildHref(item, label = "") {
  if (!item || !Array.isArray(item.children)) return "";
  const key = getSectionKey(label);
  const child = item.children.find(entry => getSectionKey(entry.label) === key);
  return child ? child.href : "";
}

function findDocumentHref(selectors = []) {
  for (const selector of selectors) {
    const link = document.querySelector(selector);
    const href = (link?.getAttribute("href") || "").trim();

    if (href && href !== "#" && !/^javascript:/i.test(href)) {
      return href;
    }
  }

  return "";
}

function getBookingHref(menuData) {
  return (
    findDocumentHref([
      'a[href*="?topic=booking"]',
      'a[href*="?topic=proposal"]',
      'a[href*="?topic=services"]',
      'a[href*="?topic=experiences"]',
      'a[href*="?service="]',
      'a[href*="?transfer="]'
    ]) ||
    findMenuItem(menuData, "Contact")?.href ||
    "#"
  );
}

function buildMenuHighlights(menuData) {
  const destinations = findMenuItem(menuData, "Destinations");
  const services = findMenuItem(menuData, "Services");

  return [
    {
      label: "Stone Town",
      meta: "Historic mornings",
      href:
        findDocumentHref(['a[href*="stone-town.html"]']) ||
        findMenuChildHref(destinations, "Zanzibar") ||
        destinations?.href ||
        "#"
    },
    {
      label: "Beach Days",
      meta: "Sandbanks and dhow light",
      href:
        findDocumentHref(['a[href*="excursions.html"]']) ||
        findMenuChildHref(services, "Excursions") ||
        services?.href ||
        "#"
    },
    {
      label: "Safari Routes",
      meta: "Mainland wilderness",
      href:
        findDocumentHref(['a[href*="safaris.html"]']) ||
        findMenuChildHref(services, "Safaris") ||
        services?.href ||
        "#"
    }
  ];
}

function buildDockItems(menuData) {
  const home = findMenuItem(menuData, "Home");
  const destinations = findMenuItem(menuData, "Destinations");
  const experiences = findMenuItem(menuData, "Experiences") || findMenuItem(menuData, "Brands");
  const services = findMenuItem(menuData, "Services");
  const about = findMenuItem(menuData, "About");
  const contactItem = findMenuItem(menuData, "Contact");

  return [
    {
      key: "home",
      label: "Home",
      href: home?.href || "#",
      matches: [home?.href].filter(Boolean),
      icon: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 10.5 12 3l9 7.5"></path>
          <path d="M5.5 9.5V21h13V9.5"></path>
        </svg>
      `
    },
    {
      key: "destinations",
      label: "Destinations",
      href: destinations?.href || "#",
      matches: [destinations?.href].filter(Boolean),
      icon: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"></path>
          <path d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
        </svg>
      `
    },
    {
      key: "trips",
      label: "Trips",
      href: experiences?.href || services?.href || "#",
      matches: [experiences?.href, services?.href].filter(Boolean),
      icon: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"></path>
          <path d="M4.5 8.5h15A1.5 1.5 0 0 1 21 10v8.5A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5V10a1.5 1.5 0 0 1 1.5-1.5Z"></path>
          <path d="M3 12h18"></path>
        </svg>
      `
    },
    {
      key: "profile",
      label: "Profile",
      href: about?.href || contactItem?.href || "#",
      matches: [about?.href, contactItem?.href].filter(Boolean),
      icon: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
          <path d="M4.5 20a7.5 7.5 0 0 1 15 0"></path>
        </svg>
      `
    }
  ];
}

function getDirectChild(element, tagName) {
  return Array.from(element.children).find(child => child.tagName === tagName) || null;
}

function getDirectChildren(element, tagName) {
  return Array.from(element.children).filter(child => child.tagName === tagName);
}

function getLinkLabel(link) {
  if (!link) return "Link";

  const href = normalizePath(link.getAttribute("href") || "");
  const ariaLabel = (link.getAttribute("aria-label") || "").trim();

  if (link.classList.contains("search-icon") || /(^|\/)search$/i.test(href)) {
    return "Search";
  }

  if (ariaLabel) {
    return ariaLabel;
  }

  const text = (link.textContent || "").replace(/\s+/g, " ").trim();
  return text || "Link";
}

function buildMenuDataFromDesktop() {
  const desktopNav = topbar ? topbar.querySelector("nav") : document.querySelector(".topbar nav");
  const rootList = desktopNav ? getDirectChild(desktopNav, "UL") : null;

  if (!rootList) {
    return [];
  }

  const items = [];

  Array.from(rootList.children).forEach(listItem => {
    if (listItem.tagName !== "LI") return;

    const directChildren = Array.from(listItem.children);
    const link = directChildren.find(child => child.tagName === "A");
    const submenu = directChildren.find(child => child.tagName === "UL");

    if (!link) return;

    const item = {
      label: getLinkLabel(link),
      href: (link.getAttribute("href") || "").trim() || "#",
      children: []
    };

    if (submenu) {
      item.children = getDirectChildren(submenu, "LI")
        .map(submenuItem => {
          const submenuLink = getDirectChild(submenuItem, "A");
          if (!submenuLink) return null;

          return {
            label: getLinkLabel(submenuLink),
            href: (submenuLink.getAttribute("href") || "").trim() || "#"
          };
        })
        .filter(Boolean);
    }

    items.push(item);
  });

  return items;
}

function ensureLogoLink(menuData) {
  const logoWrap = topbar ? topbar.querySelector(".logo") : null;
  const image = document.getElementById("zanLogo") || (logoWrap ? logoWrap.querySelector("img") : null);
  const homeHref = findMenuItem(menuData, "Home")?.href || "";

  if (!logoWrap || !image || !homeHref) {
    logo = image;
    return;
  }

  const existingLink = logoWrap.querySelector("a");

  if (!existingLink) {
    const link = document.createElement("a");
    link.href = homeHref;
    link.className = "logo-link";
    link.setAttribute("aria-label", "ZanOdysseys home");
    logoWrap.insertBefore(link, image);
    link.append(image);
  } else {
    existingLink.classList.add("logo-link");
    if (!existingLink.getAttribute("aria-label")) {
      existingLink.setAttribute("aria-label", "ZanOdysseys home");
    }
  }

  logo = image;
}

function ensureMenuToggle() {
  if (!topbar) return null;

  let toggle = document.getElementById("menuToggle");

  if (!toggle) {
    toggle = document.createElement("button");
    toggle.id = "menuToggle";
    toggle.className = "menu-toggle";
    toggle.innerHTML = "<span></span><span></span><span></span>";

    const insertionPoint = topbar.querySelector(".contact, .chevron, nav");
    if (insertionPoint) {
      topbar.insertBefore(toggle, insertionPoint);
    } else {
      topbar.append(toggle);
    }
  }

  if (!toggle.querySelector("span")) {
    toggle.innerHTML = "<span></span><span></span><span></span>";
  }

  if (toggle.tagName === "BUTTON") {
    toggle.type = "button";
  } else {
    toggle.setAttribute("role", "button");
    toggle.setAttribute("tabindex", "0");
  }

  toggle.setAttribute("aria-controls", "mobileNav");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open menu");

  menuToggle = toggle;
  return toggle;
}

function renderMobileNavItem(item, currentPath, index) {
  const sectionKey = getSectionKey(item.label);
  const itemPath = normalizePath(item.href);
  const children = Array.isArray(item.children) ? item.children : [];
  const itemCurrent = isPathWithin(currentPath, itemPath, sectionKey === "home");
  const childCurrent = children.some(child => isPathWithin(currentPath, normalizePath(child.href)));
  const sectionCurrent = itemCurrent || childCurrent;
  const sectionOpen = children.length > 0 && (childCurrent || itemCurrent);
  const detail = menuDetails[sectionKey] || null;
  const linkContent = `
    <span class="mobile-nav__copy">
      ${detail?.kicker ? `<span class="mobile-nav__kicker">${escapeHtml(detail.kicker)}</span>` : ""}
      <span class="mobile-nav__label">${escapeHtml(item.label)}</span>
      ${detail?.summary ? `<span class="mobile-nav__summary">${escapeHtml(detail.summary)}</span>` : ""}
    </span>
  `;

  if (!children.length) {
    return `
      <li class="mobile-nav__item${sectionCurrent ? " is-current-section" : ""}" data-section="${escapeHtml(sectionKey)}">
        <a class="mobile-nav__link mobile-nav__link--leaf${itemCurrent ? " is-current" : ""}" href="${escapeHtml(item.href)}">
          ${linkContent}
          <span class="mobile-nav__trail" aria-hidden="true"></span>
        </a>
      </li>
    `;
  }

  const submenuId = `mobile-nav-submenu-${index}`;
  const childrenMarkup = children
    .map(child => {
      const childCurrentState = isPathWithin(currentPath, normalizePath(child.href));

      return `
        <li>
          <a class="${childCurrentState ? "is-current" : ""}" href="${escapeHtml(child.href)}">
            ${escapeHtml(child.label)}
          </a>
        </li>
      `;
    })
    .join("");

  return `
    <li class="mobile-nav__item has-subnav${sectionCurrent ? " is-current-section" : ""}${sectionOpen ? " open" : ""}" data-section="${escapeHtml(sectionKey)}">
      <div class="mobile-nav__parent-row">
        <a class="mobile-nav__link${itemCurrent ? " is-current" : ""}" href="${escapeHtml(item.href)}">
          ${linkContent}
        </a>
        <button
          class="mobile-nav__toggle"
          type="button"
          aria-controls="${submenuId}"
          aria-expanded="${sectionOpen ? "true" : "false"}"
          aria-label="Toggle ${escapeHtml(item.label)} submenu"
        ></button>
      </div>
      <ul class="mobile-nav__submenu" id="${submenuId}">
        ${childrenMarkup}
      </ul>
    </li>
  `;
}

function buildMobileNavMarkup(menuData, bookingHref) {
  const currentPath = normalizePath(window.location.pathname);
  const destinationsHref = findMenuItem(menuData, "Destinations")?.href || "#";
  const highlights = buildMenuHighlights(menuData);
  const itemsMarkup = menuData
    .map((item, index) => renderMobileNavItem(item, currentPath, index))
    .join("");
  const highlightsMarkup = highlights
    .map(
      highlight => `
        <a class="mobile-nav__highlight" href="${escapeHtml(highlight.href)}">
          <span class="mobile-nav__highlight-label">${escapeHtml(highlight.label)}</span>
          <span class="mobile-nav__highlight-meta">${escapeHtml(highlight.meta)}</span>
        </a>
      `
    )
    .join("");

  return `
    <div class="mobile-nav__sheet">
      <div class="mobile-nav__intro">
        <p class="mobile-nav__eyebrow">ZanOdysseys Private Routes</p>
        <p class="mobile-nav__title">Island calm, cultural depth, and travel that feels considered.</p>
        <p class="mobile-nav__subtitle">From Stone Town mornings to mainland safari horizons, every journey is shaped with local care.</p>
        <div class="mobile-nav__highlights" aria-label="Featured journeys">
          ${highlightsMarkup}
        </div>
        <div class="mobile-nav__actions">
          <a class="mobile-nav__hero-link" href="${escapeHtml(bookingHref)}">Plan My Journey</a>
          <a class="mobile-nav__secondary-link" href="${escapeHtml(destinationsHref)}">View Destinations</a>
        </div>
      </div>
      <ul class="mobile-nav__list">
        ${itemsMarkup}
      </ul>
      <div class="mobile-nav__footer">
        <p class="mobile-nav__footer-note">Need a custom route?</p>
        <a class="mobile-nav__cta" href="${escapeHtml(bookingHref)}">Book Now</a>
      </div>
    </div>
  `;
}

function ensureMobileNav(menuData, bookingHref) {
  let nav = document.getElementById("mobileNav");

  if (!nav && topbar) {
    nav = document.createElement("aside");
    nav.className = "mobile-nav";
    nav.id = "mobileNav";
    topbar.insertAdjacentElement("afterend", nav);
  }

  if (!nav) return null;

  nav.classList.remove("open");
  nav.setAttribute("aria-hidden", "true");
  nav.setAttribute("aria-label", "Mobile navigation");
  nav.setAttribute("role", "navigation");

  if (!menuData.length) {
    nav.innerHTML = "";
    mobileNav = nav;
    return nav;
  }

  nav.innerHTML = buildMobileNavMarkup(menuData, bookingHref);

  mobileNav = nav;
  return nav;
}

function ensureMobileNavBackdrop() {
  if (mobileNavBackdrop) return mobileNavBackdrop;

  const existingBackdrop = document.querySelector(".mobile-nav-backdrop");
  if (existingBackdrop) {
    mobileNavBackdrop = existingBackdrop;
    return mobileNavBackdrop;
  }

  const backdrop = document.createElement("div");
  backdrop.className = "mobile-nav-backdrop";
  backdrop.addEventListener("click", () => setMobileNavState(false));
  document.body.append(backdrop);
  mobileNavBackdrop = backdrop;

  return backdrop;
}

function setSubmenuState(item, isOpen) {
  if (!item) return;

  item.classList.toggle("open", isOpen);

  const toggleButton = item.querySelector(".mobile-nav__toggle");
  if (toggleButton) {
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  }
}

function closeSiblingSubmenus(activeItem) {
  if (!mobileNav) return;

  mobileNav.querySelectorAll(".has-subnav.open").forEach(item => {
    if (item !== activeItem) {
      setSubmenuState(item, false);
    }
  });
}

function setMobileNavState(isOpen) {
  if (!menuToggle || !mobileNav) return;

  mobileNav.classList.toggle("open", isOpen);
  mobileNav.setAttribute("aria-hidden", String(!isOpen));
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  document.body.classList.toggle("menu-open", isOpen);

  if (mobileNavBackdrop) {
    mobileNavBackdrop.classList.toggle("open", isOpen);
  }
}

function bindMobileNavEvents() {
  if (!menuToggle || !mobileNav || mobileNav.dataset.bound === "true") return;

  mobileNav.dataset.bound = "true";

  menuToggle.addEventListener("click", () => {
    setMobileNavState(!mobileNav.classList.contains("open"));
  });

  if (menuToggle.tagName !== "BUTTON") {
    menuToggle.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setMobileNavState(!mobileNav.classList.contains("open"));
      }
    });
  }

  mobileNav.querySelectorAll(".mobile-nav__toggle").forEach(toggleButton => {
    toggleButton.addEventListener("click", event => {
      event.preventDefault();

      const item = toggleButton.closest(".mobile-nav__item");
      if (!item) return;

      const shouldOpen = !item.classList.contains("open");
      closeSiblingSubmenus(item);
      setSubmenuState(item, shouldOpen);
    });
  });

  mobileNav.querySelectorAll("a[href]").forEach(link => {
    const href = (link.getAttribute("href") || "").trim();

    if (!href || href === "#" || /^javascript:/i.test(href)) return;

    link.addEventListener("click", () => {
      setMobileNavState(false);
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && mobileNav.classList.contains("open")) {
      setMobileNavState(false);
    }
  });
}

function isDockItemCurrent(item, currentPath) {
  return item.matches.some(match => isPathWithin(currentPath, normalizePath(match), item.key === "home"));
}

function ensureBottomDock(menuData, bookingHref) {
  if (!document.body) return;

  document.body.classList.add("has-mobile-dock");

  const currentPath = normalizePath(window.location.pathname);
  const dockItems = buildDockItems(menuData);

  let dock = document.querySelector(".bottom-nav");
  if (!dock) {
    dock = document.createElement("nav");
    dock.className = "bottom-nav";
    dock.setAttribute("aria-label", "Mobile quick navigation");
    document.body.append(dock);
  }

  dock.innerHTML = dockItems
    .map(item => {
      const isActive = isDockItemCurrent(item, currentPath);

      return `
        <a class="bottom-nav__link${isActive ? " is-active" : ""}" href="${item.href}">
          <span class="bottom-nav__icon" aria-hidden="true">${item.icon}</span>
          <span class="bottom-nav__label">${item.label}</span>
        </a>
      `;
    })
    .join("");

  let fab = document.querySelector(".mobile-fab");
  if (!fab) {
    fab = document.createElement("a");
    fab.className = "mobile-fab";
    document.body.append(fab);
  }

  fab.href = bookingHref;
  fab.setAttribute("aria-label", "Book Now");
  fab.innerHTML = '<span class="mobile-fab__text">Book Now</span><span class="mobile-fab__icon" aria-hidden="true">&#8594;</span>';
}

function handleResize() {
  if (contact) {
    contact.classList.toggle("hidden", window.innerWidth <= NAV_BREAKPOINT);
  }

  if (window.innerWidth > NAV_BREAKPOINT) {
    setMobileNavState(false);
  }
}

function initializeFooterSubmenus() {
  document.querySelectorAll(".submenu-toggle").forEach(toggle => {
    toggle.addEventListener("click", event => {
      event.preventDefault();

      const submenu = toggle.nextElementSibling;
      if (!submenu) return;

      document.querySelectorAll(".submenu").forEach(menu => {
        if (menu !== submenu) {
          menu.style.display = "none";
        }
      });

      submenu.style.display = submenu.style.display === "block" ? "none" : "block";
    });
  });
}

function initializeLogoAnimation() {
  if (!logo) return;

  logo.style.animationPlayState = "paused";

  logo.addEventListener("click", () => {
    logo.classList.remove("logo-bounce");
    void logo.offsetWidth;
    logo.classList.add("logo-bounce");
  });
}

function initializeChevron() {
  if (!chevron || !contact) return;

  chevron.addEventListener("click", () => {
    contact.classList.toggle("hidden");
    chevron.classList.toggle("active");
  });
}

function initializeSiteChrome() {
  topbar = document.querySelector(".topbar");
  contact = document.getElementById("contact") || document.querySelector(".contact");
  chevron = document.getElementById("chevron") || document.querySelector(".chevron");
  const menuData = buildMenuDataFromDesktop();
  const bookingHref = getBookingHref(menuData);

  ensureLogoLink(menuData);
  ensureMenuToggle();
  ensureMobileNav(menuData, bookingHref);
  ensureBottomDock(menuData, bookingHref);

  if (menuToggle && mobileNav) {
    ensureMobileNavBackdrop();
    bindMobileNavEvents();
  }

  initializeLogoAnimation();
  initializeChevron();
  handleResize();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeSiteChrome();
  initializeFooterSubmenus();
  window.addEventListener("resize", handleResize);

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loading-screen");
  if (!loadingScreen) return;

  const minDisplayTime = 3500;

  setTimeout(() => {
    loadingScreen.style.animation = "fadeOut 0.5s ease forwards";

    setTimeout(() => {
      loadingScreen.remove();
      if (logo) {
        logo.style.animationPlayState = "running";
      }
    }, 500);
  }, minDisplayTime);
});
