

import { isMobile, isTablet, isDesktop } from './functions/check-viewport';
window.isMobile = isMobile

import { aPixels } from './functions/aPixels';
window.aPixels = aPixels

import { disableScroll } from './functions/disable-scroll';
window.disableScroll = disableScroll

import { enableScroll } from './functions/enable-scroll';
window.enableScroll = enableScroll

import Swiper, { Navigation, Pagination, Autoplay, Zoom, Keyboard, Thumbs, Mousewheel} from 'swiper';
Swiper.use([Navigation, Pagination, Autoplay, Zoom, Keyboard, Thumbs, Mousewheel]);
window.Swiper = Swiper

const appHeight = () => {
  const doc = document.documentElement
  doc.style.setProperty('--app-height', `${window.innerHeight}px`)
}
window.addEventListener('resize', appHeight)
appHeight()