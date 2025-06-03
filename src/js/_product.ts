import { isMobile, isTablet, isDesktop } from "./functions/check-viewport";
import { disableScroll } from "./functions/disable-scroll";
import { enableScroll } from "./functions/enable-scroll";

import fsSlider from "./components/fullScreenSlider";
import { productSliderMobile } from "./_productSliderMobile";

const activePopup = document.querySelector<HTMLElement>('.product__description-popup')
let popupContent = activePopup?.querySelector<HTMLElement>('.content')

const fullscreenSlider = document.querySelector<HTMLElement>(".fullscreen-slider")
const descriptionBg = document.querySelector<HTMLElement>('.product__description-bg')

const productSlider = document.querySelector<HTMLElement>(".product__slider")
const productContent = document.querySelector<HTMLElement>(".product__content")

if(isDesktop()) {
  document.addEventListener('keydown', (event) => {
    if(event.key === 'Escape') {
      activePopup?.classList.remove('product__description_active')
      descriptionBg?.classList.remove('bg-active')
      setTimeout(() => {
        if(popupContent) {
          popupContent.innerHTML = ""
        }
      }, 350)
      enableScroll()
    }
  })
}

if (isTablet() || isDesktop()) {

  const fullscreenThumbs = new fsSlider(fullscreenSlider as HTMLElement, {
    keyboard: { enabled: true,},
    thumbs: {
      swiper: {
        el: '.gallery-thumbs',
        slidesPerView: 4,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
      },
    },
    navigation: {
      nextEl:
        ".fullscreen-slider .slider-pagination-navigation .slider-navigation-next",
      prevEl:
        ".fullscreen-slider .slider-pagination-navigation .slider-navigation-prev",
    },
    pagination: {
      el: ".gallery-thumbs__content",
      clickable: true,
    },
  });

  document.addEventListener( 'click', (event) => {
    if(activePopup?.classList.contains('product__description_active')) {
      if(!event.composedPath().includes(activePopup)) {
        descriptionBg?.classList.remove('bg-active')
        activePopup?.classList.remove('product__description_active')
        enableScroll()
      }
    }
  })
}

if (isMobile()) {
  document.querySelectorAll('video').forEach((el) => {
    el.removeAttribute('controls')
  })
  if(productSlider && fullscreenSlider) {
    productContent?.querySelectorAll('video').forEach((el) => {
      el.removeAttribute('controls')
    })  
    productSliderMobile(productSlider, fullscreenSlider)
  }
}

async function getInfo (path:string): Promise<any> {
  const res = await fetch(path)
  const result = await res.json()
  return result.content
}
function openPopup(activePopup:HTMLElement, content: string) {

  if(popupContent) {
    popupContent.innerHTML = ""
  }

  descriptionBg?.classList.add('bg-active')
  activePopup?.classList.add('product__description_active')

  let infoContent = document.createElement('div')
  infoContent.innerHTML = content
  activePopup.querySelector('.content')?.appendChild(infoContent)

}
export async function fillProductInfo (activePopup:HTMLElement, index:number) {
  const content = await getInfo(`../api/infoProd-${index}.json`)
  setTimeout(() => {
    openPopup(activePopup, content)
  }, 250)
  // openPopup(activePopup, content)
}

document.querySelectorAll('.product__description-more').forEach((el, index) => {
  el.addEventListener('click', () => {
    disableScroll()
    if(activePopup) {
      fillProductInfo(activePopup, index)
    }
  })
})

activePopup?.querySelector('.product__description-close')?.addEventListener('click', () => {
  descriptionBg?.classList.remove('bg-active')
  activePopup?.classList.remove('product__description_active')
  enableScroll()
})