const config = {
  messageTypeCurrentPlaybackRate: 'currentPlaybackRate',
  messageTypeSetPlaybackRate: 'setPlaybackRate',
  messageTypeGetPlaybackRate: 'getPlaybackRate',

  videoTag: 'video',
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  handleMessage(request, sendResponse)
})

function handleMessage(req, res) {
  switch (req.type) {
    case config.messageTypeSetPlaybackRate:
      setPlaybackRate(req.value)
      res({ type: config.messageTypeCurrentPlaybackRate, value: getPlaybackRate() })
      return
    case config.messageTypeGetPlaybackRate:
      res({ type: config.messageTypeCurrentPlaybackRate, value: getPlaybackRate() })
      return
  }
}

function getVideoElement() {
  return document.querySelector(config.videoTag)
}

function setPlaybackRate(rate) {
  getVideoElement().playbackRate = rate
}

function getPlaybackRate() {
  return getVideoElement().playbackRate
}
