const config = {
  messageTypeCurrentPlaybackRate: 'currentPlaybackRate',
  messageTypeSetPlaybackRate: 'setPlaybackRate',
  messageTypeGetPlaybackRate: 'getPlaybackRate',
  messageTypeChangePlaybackRateByDelta: 'changePlaybackRateByDelta',
  localStorageSettingsPlaybackSpeedDeltaKey: 'playbackSpeedDelta',
  localStorageSettingsPlaybackSpeedDeltaDefaultValue: 0.1,
}

document.addEventListener(
  'DOMContentLoaded',
  function () {
    alert(JSON.stringify(getPlaybackRateDelta()))

    sendMessage({ type: config.messageTypeGetPlaybackRate }, handleMessage)

    addOnClickHandler('decreasePlaybackRate', function () {
      sendMessage({ type: config.messageTypeChangePlaybackRateByDelta, value: -0.1 }, handleMessage)
    })

    addOnClickHandler('increasePlaybackRate', function () {
      sendMessage({ type: config.messageTypeChangePlaybackRateByDelta, value: 0.1 }, handleMessage)
    })

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

function getPlaybackRateDelta() {
  return chrome.storage.sync.get([config.localStorageSettingsPlaybackSpeedDeltaKey], (res) => {
    if (!res.hasOwnProperty(config.localStorageSettingsPlaybackSpeedDeltaKey)) {
      chrome.storage.sync.set({ playbackSpeedDelta: config.localStorageSettingsPlaybackSpeedDeltaDefaultValue })
      return config.localStorageSettingsPlaybackSpeedDeltaDefaultValue
    }
    return res[config.localStorageSettingsPlaybackSpeedDeltaKey]
  })
}

function sendMessage(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, callback) //, callback)
  })
}

function displayCurrentPlaybackRate(currentPlaybackRate) {
  const currentPlaybackRateElement = document.getElementById('currentPlaybackRate')
  if (!currentPlaybackRate) {
    currentPlaybackRate = 1
  }

  currentPlaybackRateElement.innerHTML = currentPlaybackRate.toPrecision(2)
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
