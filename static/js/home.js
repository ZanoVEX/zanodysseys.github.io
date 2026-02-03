document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
      offset: 120
    });

    document.querySelectorAll(".card[data-aos]").forEach((card, i) => {
      card.setAttribute("data-aos-delay", i * 80);
    });
  }
});
