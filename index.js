document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible') {
    console.log('visible')
  } else {
    console.log('hidden')
  }
})
console.log('test')
