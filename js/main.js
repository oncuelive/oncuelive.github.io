"use strict";
{
  /** Form validation */
  document.querySelectorAll("button[type='submit']").forEach(btn => btn.addEventListener("click", e => e.target.form.classList.add("validated")));

  /** Keep trach of user input method */
  const setInput = type => document.body.dataset.input = type;
  document.addEventListener("keydown", e => { if (e.which === 9) setInput("keyboard"); });
  document.addEventListener("click", e => setInput("mouse"));
  document.addEventListener("touchstart", e => setInput("touch"));

  /* Make sure any external links are new tab */
  [...document.querySelectorAll("a")]
    .filter(a => !a.href.includes(location.hostname) && !a.getAttribute("target"))
    .forEach(a => {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });

  /** Toggle buttons */
  const toggleButtons = [...document.querySelectorAll("[data-toggle-target-id]")];

  function toggleIt(e) {
    const btn = e.target;
    const toggleTarget = document.querySelector(`#${btn.dataset.toggleTargetId}`);
    const toggleGroup = btn.dataset.toggleGroup;
    let expanded = btn.getAttribute("aria-expanded") === "true" || false;

    // Close all group buttons
    toggleButtons
      .filter(btn => btn.dataset.toggleGroup === toggleGroup)
      .forEach(btn => {
      btn.setAttribute("aria-expanded", false);
      document.querySelector(`#${btn.dataset.toggleTargetId}`).hidden = true;
    });

    // Open this'n
    btn.setAttribute("aria-expanded", !expanded);
    toggleTarget.hidden = expanded;

  }

  toggleButtons.forEach(btn => btn.addEventListener("click", toggleIt));

  /** Support Control */
  document.querySelector("#openSupport")?.addEventListener("click", e => {
    document.querySelector("#chatContainer").classList.add("open");
  });

  /** Session link checks */

  // const FROZEN_TIME = Date.parse("2021-02-23 13:29 GMT-0500"); // Frozen in time
  const FROZEN_TIME = null;

  const timeBasedEls = document.querySelectorAll("[data-start]:not(body)");

  function fakeNow(date, hourDiffMS) {
    const target = Date.parse(date);
    const today = Date.parse(new Date().toDateString());
    const diff = target - today + hourDiffMS ;

    // let fakeNow = Date.now() + diff + 28800000;
    let fakeNow = Date.now() + diff + (new Date().getTimezoneOffset() * 60 * 1000) - 19800000;

    return fakeNow;
  }

  function getNow() {
    // return fakeNow("2021-02-23", 0);
    return Date.now();
  }

  function sessionStatus(el, now) {
    console.log(`NOW: ${new Date(now).toLocaleString("en-US", { timeZone: "America/New_York" })}`);

    const openStartBuffer = 1800000; // 30 min
    const openEndBuffer = 60000; // 1 min
    const start = +el.dataset.start;
    const end = +el.dataset.end;

    const early = now <  start - openStartBuffer;
    // const open = now >= start - openStartBuffer && now < end + openEndBuffer;
    // const late = now >= end + openEndBuffer;

    // return early ? "early" : open ? "open" : late ? "late" : "";
    return early ? "early" : "open";
  }

  function checkSessPageTime() {
    console.log("Checking Session Page times.");

    const body = document.body;
    const status = sessionStatus(body, FROZEN_TIME || getNow());
    body.classList.add(status);

    if (status === "early") setTimeout(checkSessPageTime, 10000);
  }
  if (document.body.dataset.start) checkSessPageTime();

// function checkRangesLoop(now) {
//     timeBasedEls.forEach(el => {
//       const status = sessionStatus(el, now);

//       if (status === "early") {
//         el.classList.add("early");
//       } else if (status === "open") {
//         el.classList.add("open");
//         el.classList.remove("live", "early");
//       } else {
//         el.classList.remove("live", "open");
//         el.classList.add("late");
//       }
//     });
//   }
//   checkRangesLoop(FROZEN_TIME || getNow()); // Initial check

  /** Heartbeat */
  // const beat = () => {
  //   const now = FROZEN_TIME || getNow();
  //   checkRangesLoop(now);
  // };
  // window.setInterval(beat, 7000);

}