"use strict";
{
  function setChatName() {
    const chat = document.querySelector("#chatFrame");
    const name = JSON.parse(localStorage.getItem("OnCue_info"))?.name;

    if (chat && name) chat.dataset.src = `${chat.dataset.src}?username=${encodeURIComponent(name)}`;
  }
  setChatName();

  function loadToggle(e) {
    const btn = e.target;

    if (btn.dataset.loaded) return;
    btn.dataset.loaded = true;

    const iframe = document.querySelector(`#${btn.dataset.toggleTargetId} iframe[data-src]`);

    if (!iframe.src) iframe.src = iframe.dataset.src;
  }

  /** Lazy load iframes */
  const lazies = document.querySelectorAll(".console-toolbar .toggle-iframe");

  lazies.forEach(btn => btn.addEventListener("mouseover", loadToggle, { once: true }));

  function loadLazies() {
    lazies.forEach(toggle => {
      if (toggle.dataset.loaded) return;
      loadToggle({ target: toggle });
    });
  }
  window.requestIdleCallback(loadLazies, { timeout: 3000 });

  /** Toggle Fullscreen */
  const console = document.querySelector("#session-console");
  document.querySelector("#toggleFullscreen")?.addEventListener("click", e => {
    if (!document.fullscreenElement) {
      console.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  /** Close fullscreen if help clicked */
  document.querySelector("#openSupport").addEventListener("click", e => document.exitFullscreen());

  /* check qa */
  // document.querySelector("#qa iframe")?.addEventListener("load", function (e) {
  //   let me = this;
  //   setTimeout(function () {
  //     if (me.style.display === "none") {
  //       document.body.classList.add("qa-error");
  //     }

  //     document.body.classList.add("qa-loaded");
  //   }, 3000);
  // });
}