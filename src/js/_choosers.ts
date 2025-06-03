

function choosed(node_1:Element) {

  if(node_1.parentElement?.parentElement?.classList.contains('choosers__el-one')) {
    document.querySelectorAll('.choosers__el.choosers__el-one button').forEach((el) => {
      el.classList.remove('choosers__el_active')
    })
  }
  else {
    document.querySelectorAll('.choosers__el.choosers__el-two button').forEach((el) => {
      el.classList.remove('choosers__el_active')
    })
  }
  node_1.classList.add('choosers__el_active')
}

document.querySelectorAll('.choosers .choosers__el.choosers__el-one button').forEach((el) => {
  el.addEventListener('click', () => {
    choosed(el)
  })
})
document.querySelectorAll('.choosers .choosers__el.choosers__el-two button').forEach((el) => {
  el.addEventListener('click', () => {
    choosed(el)
  })
})