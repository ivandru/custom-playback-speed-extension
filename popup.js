const config = {
  messageTypeCurrentPlaybackRate: 'currentPlaybackRate',
  messageTypeSetPlaybackRate: 'setPlaybackRate',
  messageTypeGetPlaybackRate: 'getPlaybackRate',
  messageTypeChangePlaybackRateByDelta: 'changePlaybackRateByDelta',
  localStorageSettingsPlaybackSpeedDeltaKey: 'playbackSpeedDelta-t',
  localStorageSettingsPlaybackSpeedDeltaDefaultValue: 0.1,
}

document.addEventListener(
  'DOMContentLoaded',
  function () {
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

    getPlaybackRateDelta()
  },
  false
)

async function getPlaybackRateDelta() {
  return await localStorageGet({
    key: config.localStorageSettingsPlaybackSpeedDeltaKey,
    value: config.localStorageSettingsPlaybackSpeedDeltaDefaultValue,
  })
}

function localStorageGet(obj) {
  const getObj = {}
  getObj[obj.key] = obj.value

  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(getObj, (syncRes) => {
      resolve(syncRes[obj.key])
    })
  })
}

function localStorageSet(obj) {
  const getObj = {}
  getObj[obj.key] = obj.value

  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(getObj, (syncRes) => {
      alert(JSON.stringify(getObj) + ' ' + JSON.stringify(syncRes))
      resolve(syncRes)
    })
  })
}

function setPlaybackRateDelta(rateDelta) {
  chrome.storage.sync.set({ playbackSpeedDelta: config.localStorageSettingsPlaybackSpeedDeltaDefaultValue })
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
