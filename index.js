document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible') {
    console.log('visible')
  } else {
    console.log('hidden')
  }
})
console.log('test')

$(document).ready(function () {
  $('.carousel').slick({
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    autoplay: true
  })
})
