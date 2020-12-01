window.photoFrame = window.photoFrame || {}

function ViewModel() {
  var self = this
  self.gapiClient = null
  self.carouselEl = $('.carousel')[0]
  self.slickSettings = {
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    autoplay: true,
    lazyLoad: 'ondemand'
  }
  self.images = []
  self.shuffle = function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }
  self.addImages = async function () {
    var html = ''
    self.images = self.shuffle(self.images)
    const h = window.innerHeight
    const w = window.innerWidth
    for (var i = 0; i < self.images.length; i++) {
      html += `<div><img class=" full-screen-width" data-lazy="${self.images[i].baseUrl}=w${w}-h${h}"></div>`
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
        const albums = fullResponse.result.albums
        return albums
      })
  }
  self.getAlbumImageChunk = function (id, nextPageToken) {
    return self.gapiClient.photoslibrary.mediaItems
      .search({ albumId: id, pageToken: nextPageToken, pageSize: 100 })
      .then(function (response) {
        self.images = self.images.concat(response.result.mediaItems)
        return response.result.nextPageToken
      })
      .catch(function (e) {
        return undefined
      })
  }
  self.getImages = async function (id) {
    const response = await self.gapiClient.photoslibrary.albums.get({
      albumId: id
    })
    const album = response.result
    var nextPageToken = null
    var i = 0
    while (self.images.length < Number(album.mediaItemsCount) && i < 5) {
      await self
        .getAlbumImageChunk(id, nextPageToken)
        .then((token) => (nextPageToken = token))
      i++
    }
    self.addImages()
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
    self.slick = $('.carousel').slick(self.slickSettings)
  }
}
window.photoFrame = new ViewModel()
