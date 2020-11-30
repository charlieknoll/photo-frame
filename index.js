window.photoFrame = window.photoFrame || {}

document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible') {
    console.log('visible')
  } else {
    console.log('hidden')
  }
})
console.log('test')

$(document).ready(function () {
  window.photoFrame = new ViewModel(window.photoFrame.images)
  window.photoFrame.init()
})

function ViewModel(images) {
  var self = this
  self.images = images
  self.carouselEl = $('.carousel')[0]
  self.slickSettings = {
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    autoplay: true
  }
  self.addImages = function (images) {
    //<div><img class=" full-screen-width" src="images/image4.jpg"></div>
    var html = ''
    for (var i = 0; i < images.length; i++) {
      html += `<div><img class=" full-screen-width" src="${images[i]}" crossorigin="anonymous"></div>`
    }
    self.carouselEl.innerHTML = html
  }
  self.saveToStorage = function () {}
  self.loadFromStorage = function () {}
  self.googleAlbumUrl = ''
  self.hideImage = function () {}
  self.getImages = function () {
    //if images is different than current images, prompt user to load images
  }
  self.playPause = function () {}
  self.init = function () {
    self.addImages(self.images)
    self.slick = $('.carousel').slick(self.slickSettings)
  }
}
