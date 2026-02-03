if (document.querySelector('.trending-slider')) {
  new Swiper('.trending-slider', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 80,
      modifier: 1.8
    },
    autoplay: {
      delay: 3500,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });
}
if (document.querySelector('.testimonial-slider')) {
  new Swiper('.testimonial-slider', {
    loop: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false
    },
    pagination: {
      el: '.testimonial-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.testimonial-button-next',
      prevEl: '.testimonial-button-prev'
    },
    slidesPerView: 1,
    spaceBetween: 30,
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });
}
