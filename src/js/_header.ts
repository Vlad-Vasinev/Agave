
import { disableScroll } from "./functions/disable-scroll";
import { enableScroll } from "./functions/enable-scroll";
import { isDesktop } from './functions/check-viewport';

const mobileMenu = document.querySelector(".mobile-menu")
const headerInner = document.querySelector('.header-mobile__inner')

const headerDropEl = document.querySelector<HTMLElement>('.header-drop')
const headerAnimate = document.querySelector<HTMLElement>('.header-drop_animate')

const headerBurger = document.querySelector<HTMLElement>('.header-burger')

document.querySelectorAll('.header-burger').forEach((el) => {
  el.addEventListener('click', () => {

    if(!el.getAttribute('clicked')) {

      el.setAttribute('clicked', "clicked")
      mobileMenu?.classList.add("mobile-menu_active")
      headerInner?.classList.add('header-mobile_active')

      if(headerBurger) {
        headerBurger.querySelector('.click-wrapper')?.querySelector('div')?.classList.remove('menu')
        headerBurger.querySelector('.click-wrapper')?.querySelector('div')?.classList.add('close', 'animate')
      }
      
      disableScroll()
    }
    else {
      headerInner?.classList.remove('header-mobile_active')
      el.removeAttribute('clicked')
      mobileMenu?.classList.remove("mobile-menu_active")
      enableScroll()
      if(headerBurger) {

        headerBurger.querySelector('.click-wrapper')?.querySelector('div')?.classList.remove('close')
        headerBurger.querySelector('.click-wrapper')?.querySelector('div')?.classList.add('menu', 'animate')

      }
    }
  })
})

//header hover menu
if(isDesktop()) {
  headerAnimate?.addEventListener('mouseenter', () => {
    headerDropEl?.classList.add('header__info_active')
    document.querySelectorAll('.animate-symbols .animate-symbols__el').forEach((el) => {
      el.classList.add('header__el_wh')
    })
  })
  
  headerAnimate?.addEventListener('mouseleave', () => {
    headerDropEl?.classList.remove('header__info_active')
    document.querySelectorAll('.animate-symbols .animate-symbols__el').forEach((el) => {
      el.classList.remove('header__el_wh')
    })
  })
}
//header hover menu