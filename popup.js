const config = {
  messageTypeCurrentPlaybackRate: 'currentPlaybackRate',
  messageTypeSetPlaybackRate: 'setPlaybackRate',
  messageTypeGetPlaybackRate: 'getPlaybackRate',
}

document.addEventListener(
  'DOMContentLoaded',
  function () {
    sendMessage({ type: config.messageTypeGetPlaybackRate }, handleMessage)

    addOnClickHandler('normalPlaybackRate', function () {
      sendMessage({ type: config.messageTypeSetPlaybackRate, value: 1 }, handleMessage)
    })

    addOnClickHandler('doublePlaybackRate', function () {
      sendMessage({ type: config.messageTypeSetPlaybackRate, value: 2 }, handleMessage)
    })

    addOnClickHandler('triplePlaybackRate', function () {
      sendMessage({ type: config.messageTypeSetPlaybackRate, value: 3 }, handleMessage)
    })
  },
  false
)

function sendMessage(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, callback) //, callback)
  })
}

function displayCurrentPlaybackRate(currentPlaybackRate) {
  const currentPlaybackRateElement = document.getElementById('currentPlaybackRate')
  currentPlaybackRateElement.innerHTML = currentPlaybackRate
}

function handleMessage(req) {
  switch (req.type) {
    case config.messageTypeCurrentPlaybackRate:
      const currentPlaybackRate = req.value
      displayCurrentPlaybackRate(currentPlaybackRate)
      return
  }
}

function addOnClickHandler(elementId, handlerFunc) {
  const element = document.getElementById(elementId)
  element.addEventListener('click', handlerFunc)
}
