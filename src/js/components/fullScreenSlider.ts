import vanillaLazy from "vanilla-lazyload";
import { disableScroll } from "../functions/disable-scroll";
import { enableScroll } from "../functions/enable-scroll";
import { isDesktop } from "../functions/check-viewport";

import SwiperConfigured from "../shared/swiper";
const fullscreenSlider = document.querySelector<HTMLElement>(".fullscreen-slider")

export default class fsSlider extends SwiperConfigured{

  fsEl: HTMLElement;
  fsSliderEl: HTMLElement;
  fsWrpEl: HTMLElement;
  sldTpl: HTMLTemplateElement;
  sldSel: string;
  fsClose: HTMLElement;
  slidesFs: NodeListOf<Element>;
  currCtr: undefined;
  lastCtr: Element;
  fsSliderObj: SwiperConfigured;
  option: any; // Object ? 
  vl: any; // vanillaLazy essence ? 

  constructor(el:HTMLElement, options:any) {
    super(el.querySelector(".swiper-container") as HTMLElement)
    this.fsEl = el;
    this.fsSliderEl = this.fsEl.querySelector(".swiper-container") as HTMLElement;
    //this.fsSliderObj = fsSliderEl;
    this.fsWrpEl = this.fsEl.querySelector(".swiper-wrapper") as HTMLElement; // requires as HTMLElement
    this.sldTpl = this.fsEl.querySelector("#slide-tpl") as HTMLTemplateElement; // requires as HTMLTemplateElement
    this.sldSel = "." + this.sldTpl.content.firstElementChild?.classList[0];
    this.fsClose = this.fsEl.querySelector("[fs-close]") as HTMLElement;
    this.slidesFs = el.querySelectorAll('img'); // how to initialize?
    this.currCtr = undefined;
    this.lastCtr = el; // how to initialize?
    this.initFs();

    this.fsSliderObj = SwiperConfigured;
    this.option = options;  
    this.vl = this.fsSliderEl;
  }

  initFs() {
    document.querySelectorAll("[data-fs-ctr]:not(._fs-inited)").forEach((fsCtr:Element) => {
      const sldArr = fsCtr.querySelectorAll("[data-fs-full]");
      sldArr.forEach((el, index) => {

        let srcArr = Array.from(sldArr).map((el) => {
          if(el instanceof HTMLElement) {
            return el.dataset.fsFull
          }
        });
        el.addEventListener("click", () => {
          const filteredSrc = srcArr.filter((src): src is string => src !== undefined)
          this.openSlider(filteredSrc, fsCtr, index);
        });

      });
    });
  }

  openSlider(srcArr:Array<string>, fsCtr:Element, initialIndex:number) {

    if (!this.lastCtr) {
      this.lastCtr = fsCtr;
      this.slidesFs = this.mountSlides(srcArr);
      console.log(this.slidesFs)
    } else if (this.lastCtr === fsCtr) {
    } else if (fsCtr) {
      this.lastCtr = fsCtr;
      this.slidesFs = this.mountSlides(srcArr);
    }

    this.vl = new vanillaLazy(
      {
        container: this.fsSliderEl,
        unobserve_entered: true,
        thresholds: "-2%",
        class_loaded: "is-loaded",
        callback_loaded: function (el) {
          el.parentElement?.classList.add("is-loaded");

          if(isDesktop()) {
            let attr = [];
            let figures = [];

            document.querySelectorAll(".swiper-zoom-container").forEach((el, index) => {
                attr.push(el.querySelector('img')?.getAttribute("data-src"));
                el.removeAttribute("js-lazy");  

                let newFigure = `<figure class="zoo-item" data-zoo-image='${attr[index]}'></figure>`; //
                figures.push(newFigure);
                el.innerHTML = figures[index];
            });
            
            ($(".zoo-item") as any).ZooMove({});
            document.querySelectorAll('.zoo-item').forEach((el) => {
              const imgEl = el.querySelector<HTMLElement>(".zoo-img")
              if(imgEl) {
                imgEl.style.cursor = "url('../../img/circle-inside.png'), auto"
              }
            })
          }
        },
        callback_finish: function () {
          this.vl.destroy();
        }.bind(this),
      },
      
      Array.from(this.slidesFs).map((el) => el.querySelector("img")).filter((el)=> el)
    );
    this.fsClose.addEventListener("click", this.closeSlider.bind(this), {
      once: true,
    },);

    const thumbs = swiper2

    this.fsSliderObj = new SwiperConfigured(this.fsSliderEl, {
      wrapperClass: "swiper-wrapper",
      slideClass: "swiper-slide",
      loop: true,
      pagination: this.option.pagination,
      navigation: this.option.navigation,
      keyboard: this.option.keyboard,
      thumbs: this.option.thumbs,
      observer: true,
      simulateTouch: true,
      on: {
        afterInit: function () {
          let ulBullets = document.querySelector<HTMLElement>('.gallery-thumbs__content')
          ulBullets?.querySelectorAll('.swiper-pagination-bullet').forEach((item, index) => {
            item.innerHTML = `<span class="gallery-thumbs__el"><img src=${srcArr[index]}></img></span>`
          });
          //console.log(this.realIndex)
        },
        slideChange: function () {
          if(thumbs) {
            thumbs.slideTo(this.realIndex)
          }
        },
        touchMove: function () { // is firing only forwards
          if(thumbs) {
            thumbs.slideTo(this.realIndex)
          }
        },
      },
    });
    this.fsSliderObj.slideTo(initialIndex)

    this.fsEl.classList.add("_active");
    disableScroll();
  }
  closeSlider() {

    this.fsEl.classList.remove("_active");
    enableScroll();
    this.fsEl.addEventListener(
      "transitionend",
      () => {
        if (this.vl._settings) {
          this.vl.destroy();
        }
        this.fsSliderObj.destroy();
      },
      { once: true }
    );
  }
  mountSlides(srcArr:Array<string>) {
    srcArr.forEach((src:string) => {
      const firstChild = this.sldTpl.content.firstElementChild
      if(firstChild) {
        const slide = firstChild.cloneNode(true) as HTMLElement;
        const img = slide.querySelector("img")
        if(img) {
          img.dataset.src = src;
          this.fsWrpEl.appendChild(slide);
        }
      }
    });
    return this.fsWrpEl.querySelectorAll(this.sldSel);
  }
}

let swiper2 = new SwiperConfigured(".gallery-thumbs", {
  spaceBetween: 10,
  centeredSlides: true,
  slideClass: "swiper-pagination-bullet",
  allowSlideNext: true,
  allowSlidePrev: true,
  slideToClickedSlide: true,
});