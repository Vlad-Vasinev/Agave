import SwiperConfigured from "./shared/swiper";

const fullSlider = new SwiperConfigured(".full-product", {
  loop: true,
  navigation: {
    nextEl:
      ".full-product .slider-navigation .slider-navigation__next",
    prevEl:
      ".full-product .slider-navigation .slider-navigation__prev",
  },
}) 