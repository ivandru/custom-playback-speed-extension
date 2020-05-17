const config = {
  messageTypeCurrentPlaybackRate: 'currentPlaybackRate',
  messageTypeSetPlaybackRate: 'setPlaybackRate',
  messageTypeGetPlaybackRate: 'getPlaybackRate',
  messageTypeChangePlaybackRateByDelta: 'changePlaybackRateByDelta',

  localStorageSettingsPlaybackSpeedDelta: { key: 'playbackSpeedDelta', defaultValue: 0.1 },
  localStorageSettingsPlaybackSpeedForWebsite: { key: 'playbackSpeed-', defaultValue: 1 },
}

let state = {
  playbackRateDelta: {
    settingsKey: config.localStorageSettingsPlaybackSpeedDelta.key,
    value: config.localStorageSettingsPlaybackSpeedDelta.defaultValue,
    htmlId: 'currentPlaybackRateDelta',
  },
  playbackRate: {
    settingsKey: config.localStorageSettingsPlaybackSpeedForWebsite.key,
    value: config.localStorageSettingsPlaybackSpeedForWebsite.defaultValue,
    htmlId: 'currentPlaybackRate',
  },
  website: {
    value: '',
  },
}

document.addEventListener(
  'DOMContentLoaded',
  async function () {
    state.website.value = await getCurrentWebsite()
    state.playbackRate.value = await getPlaybackRateForWebsiteFromLocalStorage(state.website.value)

    sendMessage({ type: config.messageTypeSetPlaybackRate, value: state.playbackRate.value }, handleMessage)
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

async function getPlaybackRateForWebsiteFromLocalStorage(website) {
  return await localStorageGet({
    key: config.localStorageSettingsPlaybackSpeedForWebsite.key + website,
    value: config.localStorageSettingsPlaybackSpeedForWebsite.defaultValue,
  })
}

async function setPlaybackRateForWebsiteToLocalStorage(website, playbackSpeed) {
  return await localStorageSet({
    key: config.localStorageSettingsPlaybackSpeedForWebsite.key + website,
    value: playbackSpeed,
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

async function getCurrentWebsite() {
  return await new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, function (tabs) {
      resolve(tabs[0].url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/gim))
    })
  })
}

function handleMessage(req) {
  switch (req.type) {
    case config.messageTypeCurrentPlaybackRate:
      const currentPlaybackRate = req.value
      getCurrentWebsite().then((website) => setPlaybackRateForWebsiteToLocalStorage(website, currentPlaybackRate))
      displayCurrentPlaybackRate(currentPlaybackRate)
      return
  }
}

function addOnClickHandler(elementId, handlerFunc) {
  const element = document.getElementById(elementId)
  element.addEventListener('click', handlerFunc)
}
