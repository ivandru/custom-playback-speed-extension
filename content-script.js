var s = document.createElement("script")
s.src = chrome.extension.getURL("injected-script.js")
;(document.head || document.documentElement).appendChild(s)

// s.parentNode.removeChild(s)

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request)
  handleMessage(request, sendResponse)
})

// let contentPort = chrome.runtime.connect({
//   name: "playback-speed-extension-port",
// })

function handleMessage(req, res) {
  switch (req.type) {
    case "setPlaybackRate":
      setPlaybackRate(req.value)
      res({ type: "currentPlaybackRate", value: getPlaybackRate() })
      return
    case "getPlaybackRate":
      getPlaybackRate()
      return
  }
}

function setPlaybackRate(rate) {
  console.log(`Going to send setPlaybackRateInjected with rate of: ${rate}`)
  window.dispatchEvent(new CustomEvent("setPlaybackRateInjected", { detail: { playbackRate: rate } }))
}

function getPlaybackRate(rate) {
  window.dispatchEvent(new CustomEvent("getPlaybackRateInjected"))
}

window.addEventListener(
  "message",
  function receiveResponse(event) {
    if (event.data.type === "currentPlaybackRate") {
      // window.removeEventListener("message", receiveResponse, false)
      chrome.extension.sendMessage({ type: "currentPlaybackRate", value: event.data.value })
    }
  },
  false
)
