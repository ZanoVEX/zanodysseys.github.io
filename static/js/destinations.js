/* ===============================
   DESTINATIONS PAGE SCRIPT
================================ */

document.addEventListener("DOMContentLoaded", () => {

  // Guard: only run on destinations pages
  if (!document.body.classList.contains("destinations-page")) return;

  /* Highlight active destination card */
  document.querySelectorAll(".destination-card").forEach(card => {
    card.addEventListener("click", () => {
      document
        .querySelectorAll(".destination-card")
        .forEach(c => c.classList.remove("active"));

      card.classList.add("active");
    });
  });

});