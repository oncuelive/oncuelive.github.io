"use strict";
{
  function customizeContextMenu(container) {
    const contextMenu = container.querySelector(".theo-context-menu");

    contextMenu.innerHTML = `
    <li>Click the "Live" button in the bottom-left to go back to live.</li>
    `;
  }

  const theoCheckWait = 1000;
  const theooooElement = document.querySelector(".theoplayer-container");
  const liveSource = theooooElement.dataset.video;
  const preroll = theooooElement.dataset.preroll;

  async function isLive(hls) {
    const res = await fetch(hls);
    return res.status === 200;
  }

  function tryAgainLater(fnName, reason, waitMS) {
    if (reason) console.log(`${reason} - trying again...`);
    setTimeout(fnName, waitMS);
  }

  async function startCheckingStream(hls) {
    if (await isLive(liveSource) === false) tryAgainLater(startCheckingStream, "Stream not live", theoCheckWait);
    else theooooElement.classList.add("has-stream");
  }

  function initTHEOOO(startHLS) {
    startCheckingStream(startHLS);

    let player = new THEOplayer.Player(theooooElement, {
      libraryLocation: "https://cdn.myth.theoplayer.com/3163acf8-0c05-4d9d-966f-f3927f5bb90e",
      license: "sZP7IYe6T6fcCD3e0ubi06klTS4KFSa_3Sb-TSbZTmk13lg6Tuft0LRk3le6FOPlUY3zWokgbgjNIOf9flfZ0SA10uXgFSaz0Se-3Q4KTmzr3uBrFSCzIQfoTSboCSetC6fVfK4_bQgZCYxNWoryIQXzImf90SCc3lbk0lRi0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lBc3laiTuBi3l5ZFOPeWok1dDrLYtA1Ioh6TgV6UQ1gWtAVCYggb6rlWoz6FOPVWo31WQ1qbta6FOfJfgzVfKxqWDXNWG3ybojkbK3gflNWfGxEIDjiWQXrIYfpCoj-f6i6WQjlCDcEWt3zf6i6v6PUFOPLIQ-LflNWfK1zWDikfgzVfG3gWKxydDkibK4LbogqW6f9UwPkIYz"
    });
    customizeContextMenu(theooooElement);

    const Button = THEOplayer.videojs.getComponent("Button");
    const ccButton = THEOplayer.videojs.extend(Button, {
      constructor: function() {
        Button.apply(this, arguments);

        this.el().dataset.toggleTargetId = "cc-info";
      },
      handleClick: function() {},
      buildCSSClass: function() {
        return "vjs-button cc";
      }
    });
    THEOplayer.videojs.registerComponent("ccButton", ccButton);
    player.ui.getChild("controlBar").addChild("ccButton", {});

    // const initSource = preroll

    /**
     *
     * If the stream isn't live, and preroll is live, load the preroll then keep checking the stream
     *
     * Shouldn't get here if there's not a preroll
     *
     */

    player.source = {
      sources: [{
        "src": startHLS,
        "type": "application/x-mpegurl",
        "lowLatency": false
      }]

    };

    player.autoplay = true;
    player.preload = "auto";
  }
  initTHEOOO(liveSource);

}