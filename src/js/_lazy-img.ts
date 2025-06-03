import LazyLoad from "vanilla-lazyload";
import vanillaLazy from "vanilla-lazyload";

var lazyLoadInstance = new LazyLoad({

});

lazyImgInit()

function lazyImgInit() {
  function setLazyBg() {
    document.querySelectorAll('[js-lazy]').forEach((el) => {
      el.classList.add('had-loaded')
    })
  }
  setLazyBg()

  let imgContainersLazy = document.querySelectorAll('[js-lazy]:not(.swiper-slide) > img[data-src], [js-lazy]:not(.swiper-slide) > video[data-src]');
  window.globalLazy = new vanillaLazy(
    {
      unobserve_entered: true,
      class_loaded: 'is-loaded',
      callback_loaded: (el) => {
        setTimeout(() => el.parentElement.style.backgroundImage = '', 1500)
      }
    },
    imgContainersLazy
  );
}

window.globalLazyUpdate = function () {
  if (window.globalLazy.hasOwnProperty()) {
    window.globalLazy.destroy()
  }
  setLazyBg()
  let newContainers = document.querySelectorAll('[js-lazy]:not(.swiper-slide):not(is-loaded) > img[data-src], [js-lazy]:not(.swiper-slide):not(is-loaded) > video[data-src]');
  window.globalLazy = new vanillaLazy(
    {
      unobserve_entered: true,
      class_loaded: 'is-loaded',
      callback_loaded: (el) => {
        setTimeout(() => el.parentElement.style.backgroundImage = '', 1500)
      }
    },
    newContainers
  );
}