const config = {
  messageTypeCurrentPlaybackRate: 'currentPlaybackRate',
  messageTypeSetPlaybackRate: 'setPlaybackRate',
  messageTypeGetPlaybackRate: 'getPlaybackRate',
  messageTypeChangePlaybackRateByDelta: 'changePlaybackRateByDelta',

  localStorageSettingsPlaybackSpeedDelta: { key: 'playbackSpeedDelta', defaultValue: 0.1 },
}

let state = {
  playbackRateDelta: {
    settingsKey: config.localStorageSettingsPlaybackSpeedDelta.key,
    value: config.localStorageSettingsPlaybackSpeedDelta.defaultValue,
    htmlId: 'currentPlaybackRateDelta',
  },
}

document.addEventListener(
  'DOMContentLoaded',
  async function () {
    sendMessage({ type: config.messageTypeGetPlaybackRate }, handleMessage)

    addOnClickHandler('decreasePlaybackRate', function () {
      sendMessage({ type: config.messageTypeChangePlaybackRateByDelta, value: -state.playbackRateDelta.value }, handleMessage)
    })

    addOnClickHandler('increasePlaybackRate', function () {
      sendMessage({ type: config.messageTypeChangePlaybackRateByDelta, value: state.playbackRateDelta.value }, handleMessage)
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

    addOnClickHandler('saveSettings', async function () {
      const val = parseFloat(getValueFromHtml('getPlaybackRateDelta'))
      state.playbackRateDelta.value = await setPlaybackRateDelta({ key: config.localStorageSettingsPlaybackSpeedDelta.key, value: val })
      setToHtml(state.playbackRateDelta.htmlId, state.playbackRateDelta.value)
    })

    state.playbackRateDelta.value = await getPlaybackRateDeltaFromLocalStorage()
    setToHtml(state.playbackRateDelta.htmlId, state.playbackRateDelta.value)
  },
  false
)

async function getPlaybackRateDeltaFromLocalStorage() {
  return await localStorageGet({
    key: config.localStorageSettingsPlaybackSpeedDelta.key,
    value: config.localStorageSettingsPlaybackSpeedDelta.defaultValue,
  })
}

function getValueFromHtml(elementId) {
  return document.getElementById(elementId).value
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
      resolve(obj.value)
    })
  })
}

async function setPlaybackRateDelta(obj) {
  return await localStorageSet(obj)
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

function setToHtml(elementId, value) {
  document.getElementById(elementId).innerHTML = value
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
