function slideEffectButton() {
  document.querySelectorAll('.slide-button').forEach(
    (el) => {
      try {
        const innerSpan = el.querySelector<HTMLElement>('span')
        const container = document.createElement('div')
        container.className = 'slide-button-inner'
        if(innerSpan) {
          container.appendChild(innerSpan.cloneNode(true))
          container.appendChild(innerSpan.cloneNode(true))
          innerSpan.remove()
          el.insertBefore(container, el.firstChild);
        }
      } catch (error) {
        // console.log('slide effect error on', el, error);
      }
    }
  )
}

slideEffectButton()