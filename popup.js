document.addEventListener(
  "DOMContentLoaded",
  function () {
    console.log("Loaded Extension Popup HTML")

    chrome.runtime.onConnect.addListener(function (portFrom) {
      if (portFrom.name === "playback-speed-extension-port") {
        portFrom.onMessage.addListener(function (message) {
          handleMessage(message)
        })
      }
    })

    sendMessage({ type: "getPlaybackRate" })

    addOnClickHandler("doubleSpeed", () => {
      sendMessage({ type: "setPlaybackRate", value: 2 })
    })

    addOnClickHandler("tripleSpeed", () => {
      sendMessage({ type: "setPlaybackRate", value: 3 })
    })
  },
  false
)

function sendMessage(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message)
  })
}

function displayCurrentSpeed(currentSpeed) {
  const currentSpeedElement = document.getElementById("currentSpeed")
  currentSpeedElement.value = currentSpeed
}

function handleMessage(message) {
  if (message.type == "currecurrentPlaybackRatentSpeed") {
    const currentSpeed = message.value
    console.log(`Current Speed is ${currentSpeed}`)
    displayCurrentSpeed(currentSpeed)
  }
}

function addOnClickHandler(elementId, handlerFunc) {
  const checkPageButton = document.getElementById(elementId)
  checkPageButton.addEventListener("click", handlerFunc)
  //     function () {
  //       chrome.tabs.getSelected(null, function (tab) {
  //         d = document
  //         const f = d.createElement("form")
  //         f.action = "http://gtmetrix.com/analyze.html?bm"
  //         f.method = "post"
  //         const i = d.createElement("input")
  //         i.type = "hidden"
  //         i.name = "url"
  //         i.value = tab.url
  //         f.appendChild(i)
  //         d.body.appendChild(f)
  //         f.submit()
  //       })
  //     },
  //     false
  //   )
}
