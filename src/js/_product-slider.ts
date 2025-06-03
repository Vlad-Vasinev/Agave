import { isMobile } from "./functions/check-viewport";
import SwiperConfigured from "./shared/swiper";

if(isMobile()) {
  if(document.querySelectorAll('.special-wrapper').length != 0) {
    document.querySelectorAll('.special-wrapper').forEach((item) => {
      const specialSlider = new SwiperConfigured(item as HTMLElement, {
        speed: 900,
        slidesPerView: "auto",
        direction: 'horizontal',
      })  
    })
  }
}