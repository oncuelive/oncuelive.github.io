"use strict";
{

  function customizeContextMenu(container) {
    const contextMenu = container.querySelector(".theo-context-menu");

    contextMenu.innerHTML = `
    <li>Click the video to pause/play</li>
    <li>Click the "Live" button in the bottom-left to go back to live.</li>
    `;
  }

  const element = document.querySelector(".theoplayer-container");
  const source = element.dataset.video;
  let player = new THEOplayer.Player(element, {
    libraryLocation: "https://cdn.myth.theoplayer.com/3163acf8-0c05-4d9d-966f-f3927f5bb90e"
  });
  customizeContextMenu(element);

  const Button = THEOplayer.videojs.getComponent("Button");
  const ccButton = THEOplayer.videojs.extend(Button, {
    constructor: function() {
      Button.apply(this, arguments);

      this.el().dataset.toggleTargetId = "cc-info";
    },
    handleClick: function() {
    },
    buildCSSClass: function() {
      return "vjs-button cc";
    }
  });
  THEOplayer.videojs.registerComponent("ccButton", ccButton);
  player.ui.getChild("controlBar").addChild("ccButton", {});

  // OPTIONAL CONFIGURATION
  // Customized video player parameters
  player.source = {
    sources: [{
      "src": source,
      "type": "application/x-mpegurl",
      "lowLatency": false
    }]

  };

  player.autoplay = true;
  player.preload = 'auto';
}