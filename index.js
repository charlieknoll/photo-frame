window.photoFrame = window.photoFrame || {}

document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible') {
    console.log('visible')
  } else {
    console.log('hidden')
  }
})
console.log('test')

function ViewModel() {
  var self = this
  self.gapiClient = null
  self.carouselEl = $('.carousel')[0]
  self.slickSettings = {
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    autoplay: true
  }
  self.loadPhotoDetail = async function (id) {
    return self.gapiClient.photoslibrary.mediaItems
      .get({ mediaItemId: id })
      .then((response) => {
        return response.result
      })
      .catch(function (e) {
        return undefined
      })
  }

  self.addImages = async function (images) {
    //<div><img class=" full-screen-width" src="images/image4.jpg"></div>
    var html = ''
    for (var i = 0; i < images.length; i++) {
      //const imageDetail = await self.loadPhotoDetail(images[i].id)
      html += `<div><img class=" full-screen-width" src="${images[i].baseUrl}"></div>`
    }
    self.carouselEl.innerHTML = html
  }
  self.saveToStorage = function () {}
  self.loadFromStorage = function () {}
  self.googleAlbumUrl = ''
  self.hideImage = function () {}
  self.loadAlbums = function () {
    return self.gapiClient.photoslibrary.albums
      .list({})
      .then(function (fullResponse) {
        // { result: { albums } }
        const albums = fullResponse.result.albums
        // Handle the results here (response.result has the parsed body).
        return albums
      })
  }
  self.getImages = async function (id) {
    const album = await this.gapiClient.photoslibrary.albums
      .get({ albumId: id })
      .then((response) => {
        return response.result
      })
      .then((album) => {
        //console.log('loadAlbumDetail album', album)
        return this.gapiClient.photoslibrary.mediaItems
          .search({ albumId: id })
          .then(function (response) {
            //console.log('loadAlbumDetail then response', response)

            // join album data with mediaItems corresponding to album
            return {
              ...album,
              result: response.result
            }
          })
      })
      .catch(function (e) {
        return undefined
      })
    self.addImages(album.result.mediaItems)
  }
  self.playPause = function () {}
  self.init = async function (gapiClient) {
    self.gapiClient = gapiClient
    const albums = await self.loadAlbums()
    const result = albums.filter((a) => {
      return a.title == 'Photo Frame'
    })
    if (result.length != 1) {
      //TODO show user a message about creating album
      console.log("'Photo Frame' album not found")
      return
    }
    await self.getImages(result[0].id)
    //console.log(self.loadAlbums())
    //self.addImages(self.images)
    self.slick = $('.carousel').slick(self.slickSettings)
  }
}
window.photoFrame = new ViewModel()
