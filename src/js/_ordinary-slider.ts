import { isMobile } from "./functions/check-viewport"
import SwiperConfigured from "./shared/swiper"
// import Swiper from "swiper"


function ordSlider () {
  
  const sliderEl = document.querySelector<HTMLElement>('.ordinary-slider')
  const setColor = (color:string) => {
    document.body.style.setProperty('--headerColor', color)
  }
  
  const headerEl = document.querySelector<HTMLElement>('.header')
  if (!sliderEl || !headerEl) return


  const ordSwiper = new SwiperConfigured(sliderEl, {
    speed: 700,
    direction: 'vertical',
    loop: true,
    mousewheel: {
      enabled: true,
      sensitivity: 120,
    },
    pagination: {
      el: ".swiper-pagination.ordinary-pagination",
      type: "bullets",
      clickable: true,
    },
    on: {
      slideChange: changeColor
    }
  })

  function changeColor (sw:SwiperConfigured) {
    
    const sliderEl = sw.el
    const currentIndex = sw.activeIndex
    const currentSlide = sw.slides[currentIndex]

    sliderEl.style.setProperty("--sliderIndex", `${currentIndex}`)

    if(currentSlide.classList.contains('ordinary-slider__el_bg-black')) {
      setColor(`#ffffff`)
    }
    else {
      setColor(`#000000`)
    }
  }

  if(isMobile()) {
    if(document.querySelector<HTMLElement>('.move-next')) {
      document.querySelector<HTMLElement>('.move-next')?.addEventListener('click', () => {
        ordSwiper.slideNext()
      })
    }
  } 

}

ordSlider()

