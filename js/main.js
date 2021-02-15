"use strict";
{
  // function setScrollWatch() {
  //   let observer = new IntersectionObserver(entries => {
  //     entries.forEach(entry => {
  //       if (entry.isIntersecting) {
  //         document.body.classList.remove("scrolled");
  //       } else {
  //         document.body.classList.add("scrolled");
  //       }
  //     });
  //   });
  //   observer.observe(document.querySelector("header"));
  // }
  // setScrollWatch();

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

  /** Carousels */
  const carousels = document.querySelectorAll(".siema");
  carousels.forEach(carousEl => {
    carousEl.control = new Siema({
      selector: carousEl,
      duration: 700,
      loop: true,
      draggable: false
    });

    carousEl.parentElement.carousel = carousEl.control;
  });

 function loopCarousels() {
  carousels.forEach(carousEl => {
    carousEl.control.next();
  });
 }

 document.querySelectorAll(".carousel-wrap button").forEach(btn => {
   const carousel = btn.parentElement.carousel;

   if (btn.classList.contains("prev")) {
     btn.addEventListener("click", e => carousel.prev());
   } else {
     btn.addEventListener("click", e => carousel.next());
   }

 });

  /** Session link checks */

  // const FROZEN_TIME = Date.parse("2021-02-17 12:00 GMT-0600"); // Frozen in time
  const FROZEN_TIME = null;

  const timeBasedEls = document.querySelectorAll("[data-start]:not(body)");

  function fakeNow(date, hourDiffMS) {
    const target = Date.parse(date);
    const today = Date.parse(new Date().toDateString());
    const diff = target - today + hourDiffMS ;

    let fakeNow = Date.now() + diff + 28800000;

    console.log(`FakeNow: ${new Date(fakeNow).toLocaleString("en-US", { timeZone: "America/Chicago" })}`);
    return fakeNow;
  }

  function getNow() {
    // return fakeNow("2021-02-17", 0);
    return Date.now();
  }

  function sessionStatus(el, now) {
    const openStartBuffer = 1200000; // 20 min
    const openEndBuffer = 60000; // 1 min
    const start = +el.dataset.start;
    const end = +el.dataset.end;

    const early = now <  start - openStartBuffer;
    const open = now >= start - openStartBuffer && now < end + openEndBuffer;
    // const live = now > start && now < end;
    const late = now >= end + openEndBuffer;

    // return early ? "early" : live ? "live" : open ? "open" : late ? "late" : false;
    return early ? "early" : open ? "open" : late ? "late" : false;
  }

  function checkSessPageTime() {
    console.log("Checking Session Page times.");

    const body = document.body;
    const status = sessionStatus(body, FROZEN_TIME || getNow());
    body.classList.add(status);

    if (status === "early") setTimeout(checkSessPageTime, 10000);
  }
  if (document.body.dataset.start) checkSessPageTime();

  function checkRangesLoop(now) {
    timeBasedEls.forEach(el => {
      const status = sessionStatus(el, now);

      if (status === "early") {
        el.classList.add("early");
      // } else if (status === "live") {
      //   el.classList.add("open", "live");
      //   el.classList.remove("early");
      } else if (status === "open") {
        el.classList.add("open");
        el.classList.remove("live", "early");
      } else {
        el.classList.remove("live", "open");
        el.classList.add("late");
      }
    });
  }
  checkRangesLoop(FROZEN_TIME || getNow()); // Initial check

  /** Upcoming Session alert checks  */
  const notifications =JSON.parse(document.body.dataset.notifications);

  function checkNotifications(now) {
    console.log(notifications);
    const bufferMS = 300000; // 5 minutes

    notifications.forEach(notification => {
      if (notification.type === "session" && !document.body.classList.contains("session-page")) return false;

      const diff = now - notification.time;
      if (diff > 0 && diff < bufferMS && !notification.done) {
        notification.done = true;
        showNotification(notification.msg);
      }
    });
  }

  /** Heartbeat */
  const beat = () => {
    const now = FROZEN_TIME || getNow();
    loopCarousels(now);
    checkRangesLoop(now);
    if (notifications.length > 0) checkNotifications(now); // Should be conditional: if body.dataset.dayType = "conference"
  };
  window.setInterval(beat, 7000);

  /** Notifications */
  const notificationsEl = document.querySelector("#notifications");

  notificationsEl?.addEventListener("click", e => e.target.classList.remove("shown"));

  function showNotification(msg) {
    console.log("SHOW");
    if (showNotification.running) return false;

    showNotification.running = true;
    notificationsEl.innerHTML = msg;
    notificationsEl.classList.add("shown");

    setTimeout(() => {
      notificationsEl.classList.remove("shown");
      showNotification.running = false;
    }, 10000);
  }

  /** Filters */
  const schedule = document.querySelector(".schedule");

  document.querySelectorAll("button[data-tag]").forEach(btn => btn.addEventListener("click", e => {

    document.querySelectorAll(".filter [aria-pressed='true']").forEach(btn => btn.setAttribute("aria-pressed", "false"));
    e.target.setAttribute("aria-pressed", "true");
    schedule.dataset.filter = e.target.dataset.tag;

  }));

}