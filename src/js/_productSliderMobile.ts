import fsSlider from "../js/components/fullScreenSlider";
import SwiperConfigured from "./shared/swiper";

export function productSliderMobile (productSlider:HTMLElement, fullscreenSlider:HTMLElement) {
  const ordSwiper = new SwiperConfigured(productSlider, {
    slidesPerView: 1,
    zoom: true,
    allowTouchMove: true,
    direction: "horizontal",
    loop: true,
    pagination: {
      el: ".swiper-pagination", 
      clickable: true,
    },
  });
  const fullscreen = new fsSlider(fullscreenSlider, {
    allowTouchMove: false,
    keyboard: {
      enabled: false,
    },
    navigation: {
      nextEl: "",
      prevEl: "",
    },
    pagination: {
      el: ".fullscreen-slider .slider-pagination-navigation .swiper-pagination",
      clickable: true,
    },
  });
}