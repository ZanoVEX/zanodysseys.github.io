const cards = document.querySelectorAll(".card");
const sections = document.querySelectorAll("section");
const clearBtn = document.getElementById("clearFocus");

/* ===== CORE FUNCTIONS ===== */
function focusCard(card){
  clearBtn.style.display = "block";

  cards.forEach(c=>{
    c.classList.toggle("highlight", c === card);
    c.classList.toggle("fade", c !== card);
  });

  highlightSection(card);
}

function highlightSection(card){
  sections.forEach(sec =>
    sec.querySelector(".section-title")?.classList.remove("focused")
  );
  const section = card.closest("section");
  section?.querySelector(".section-title")?.classList.add("focused");
}

function clearFocus(){
  document.body.classList.remove("details-open");

  document
    .querySelectorAll(".card.expand-left, .card.expand-right, .card.expand-center")
    .forEach(c => {
      c.classList.remove("expand-left","expand-right","expand-center");
      c.querySelector(".view-btn")
        ?.setAttribute("aria-expanded","false");
    });

  cards.forEach(card => card.classList.remove("fade","highlight"));
  sections.forEach(sec =>
    sec.querySelector(".section-title")?.classList.remove("focused")
  );

  clearBtn.style.display = "none";

  document.querySelectorAll(".filter-btn")
    .forEach(btn => btn.classList.remove("active"));

  document
    .querySelector('[onclick*="filterRegion(\'all\'"]')
    ?.classList.add("active");
}

/* ===== REGION FILTER ===== */
function filterRegion(region, event){
  // Close any open details first
  document.body.classList.remove("details-open");
  document
    .querySelectorAll(".card.expand-left, .card.expand-right, .card.expand-center")
    .forEach(c => c.classList.remove("expand-left","expand-right","expand-center"));

  clearBtn.style.display = "block";

  document.querySelectorAll(".filter-btn")
    .forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");

  cards.forEach(card=>{
    if(region === "all" || card.classList.contains(region)){
      card.classList.add("highlight");
      card.classList.remove("fade");
    } else {
      card.classList.add("fade");
      card.classList.remove("highlight");
    }
  });
}

/* ===== HASH SUPPORT ===== */
document.addEventListener("DOMContentLoaded", ()=>{
  const hash = window.location.hash.replace("#","");
  if(hash){
    const target = document.getElementById(hash);
    if(target) focusCard(target);
    setTimeout(()=>{
      target?.scrollIntoView({ behavior:"smooth", block:"center" });
    }, 300);
  }

  const params = new URLSearchParams(window.location.search);
  const region = params.get("region");
  if(region){
    cards.forEach(card=>{
      card.classList.toggle("highlight", card.classList.contains(region));
      card.classList.toggle("fade", !card.classList.contains(region));
    });
    clearBtn.style.display = "block";
  }
});

/* ===== CLICK TO FOCUS ===== */
cards.forEach(card=>{
  card.addEventListener("click", e=>{
    if(
      e.target.closest(".view-btn") ||
      e.target.closest(".wa-btn") ||
      e.target.closest(".card-details-panel")
    ) return;

    focusCard(card);
  });
});

/* ===== TOGGLE DETAILS ===== */
function toggleDetails(e){
  e.preventDefault();   // ✅ important
  e.stopPropagation();

  const card = e.target.closest(".card");
  const btn  = card.querySelector(".view-btn");

  // Close other open cards
  document
    .querySelectorAll(".card.expand-left, .card.expand-right, .card.expand-center")
    .forEach(c=>{
      if(c !== card){
        c.classList.remove("expand-left","expand-right","expand-center");
        c.querySelector(".view-btn")
          ?.setAttribute("aria-expanded","false");
      }
    });

  // If clicking same open card → close it
  if(
    card.classList.contains("expand-left") ||
    card.classList.contains("expand-right") ||
    card.classList.contains("expand-center")
  ){
    card.classList.remove("expand-left","expand-right","expand-center");
    btn?.setAttribute("aria-expanded","false");
    document.body.classList.remove("details-open");
    return;
  }

  // Decide expansion direction
  const rect = card.getBoundingClientRect();
  const mid  = window.innerWidth / 2;

  if(rect.right < mid){
    card.classList.add("expand-right");
  } else if(rect.left > mid){
    card.classList.add("expand-left");
  } else {
    card.classList.add("expand-center");
  }

  btn?.setAttribute("aria-expanded","true");
  document.body.classList.add("details-open");

 // 📱 MOBILE ONLY — scroll ONLY the details panel
if (window.innerWidth <= 720) {
  const panel = card.querySelector(".card-details-panel");
  panel?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

}

/* ===== CLICK OUTSIDE TO CLOSE ===== */
document.addEventListener("click", e=>{
  if(!e.target.closest(".card")){
    document
      .querySelectorAll(".card.expand-left, .card.expand-right, .card.expand-center")
      .forEach(c=>{
        c.classList.remove("expand-left","expand-right","expand-center");
        c.querySelector(".view-btn")
          ?.setAttribute("aria-expanded","false");
      });

    document.body.classList.remove("details-open");
  }
});

/* ===== ESC KEY CLOSE ===== */
document.addEventListener("keydown", e=>{
  if(e.key !== "Escape") return;

  const openCards = document.querySelectorAll(
    ".card.expand-left, .card.expand-right, .card.expand-center"
  );
  if(!openCards.length) return;

  openCards.forEach(card=>{
    card.classList.remove("expand-left","expand-right","expand-center");
    card.querySelector(".view-btn")
      ?.setAttribute("aria-expanded","false");
  });

  document.body.classList.remove("details-open");
});

