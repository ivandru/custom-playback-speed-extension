window.addEventListener(
  "setPlaybackRateInjected",
  function (event) {
    console.log(event)
    setPlaybackRate(event.detail.playbackRate)
    window.postMessage({ type: "currentPlaybackRate", value: getPlaybackRate() }, "*")
    console.log("done")
  },
  false
)

window.addEventListener(
  "getPlaybackRateInjected",
  function (event) {
    console.log(event)
    window.postMessage({ type: "currentPlaybackRate", value: getPlaybackRate() }, "*")
    console.log("done")
  },
  false
)

function setPlaybackRate(newRate) {
  console.log(`Going to set rate to ${newRate}`)
  window.playerInstance.setPlaybackRate(newRate)
  console.log(window.playerInstance.getPlaybackRate())
}

function getPlaybackRate() {
  window.playerInstance.getPlaybackRate()
}
