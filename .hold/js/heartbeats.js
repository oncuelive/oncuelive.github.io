 /** Session link checks */
  const minutesToMS = (minutes = 0) => minutes *  60 * 1000;

  // const FROZEN_TIME = Date.parse("2021-02-17 12:00 GMT-0600"); // Frozen in time
  const FROZEN_TIME = null;

  const timeBasedEls = document.querySelectorAll("[data-start]:not(body)");

  function fakeNow(mod = 0) {
    const date = "2021-03-02";
    const target = Date.parse(date);
    const today = Date.parse(new Date().toDateString());
    const diff = target - today;

    let fakeNow = Date.now() + diff + (minutesToMS(new Date().getTimezoneOffset())) + mod;

    console.log(`FakeNow: ${new Date(fakeNow).toLocaleString("en-US", { timeZone: "America/Chicago" })}`);
    return fakeNow;
  }

  function getNow() {
    return Date.now();
    // return FROZEN_TIME ? FROZEN_TIME : fakeNow(minutesToMS(-323));
  }

  function sessionStatus(el, now, override = false) {
    const openStartBuffer = minutesToMS(20);
    const openEndBuffer = minutesToMS(10);
    const start = +el.dataset.start;
    const end = +el.dataset.end;

    const early = now <  start - openStartBuffer;
    const open = now >= start - openStartBuffer && now < end + openEndBuffer;
    const late = now >= end + openEndBuffer;

    return override ? "open" : early ? "early" : open ? "open" : late ? "late" : false;
  }

  function checkSessPageTime(now) {
    console.log("Checking Session Page times.");

    const override = false;

    if (checkSessPageTime.opened) return false;

    const body = document.body;
    const status = sessionStatus(body, now, override);
    body.classList.remove("early", "open", "late");
    body.classList.add(status);

    if (status === "open") checkSessPageTime.opened = true;
    // if (status === "late") document.querySelector(".theoplayer-container").innerHTML = "";
  }
  if (document.body.dataset.start) checkSessPageTime(getNow());

  function checkRangesLoop(now) {
    console.log("Checking Start times.");
    timeBasedEls.forEach(el => {
      const status = sessionStatus(el, now);

      el.classList.remove("early", "open", "late");
      el.classList.add(status);
    });
  }
  if (timeBasedEls.length > 0) checkRangesLoop(getNow()); // Initial check

  /** Upcoming Session alert checks  */
  const notifications = document.body.dataset.notifications ? JSON.parse(document.body.dataset.notifications) : false;

  function checkNotifications(now) {
    console.log(notifications);
    const bufferMS = minutesToMS(5);

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
    const now = getNow();

    if (carousels.length > 0) loopCarousels(now);
    if (timeBasedEls.length > 0) checkRangesLoop(now);
    if (notifications.length > 0) checkNotifications(now);
    if (document.body.dataset.start) checkSessPageTime(now);
  };
  // window.setInterval(beat, 7000);

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