"use strict";
{
  function setScrollWatch() {
    const header = document.querySelector("header");

    if (header) {
      let observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            document.body.classList.remove("scrolled");
          } else {
            document.body.classList.add("scrolled");
          }
        });
      });
      observer.observe(header);
    }
  }
  setScrollWatch();

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
    const clickBtn = e.target;
    const toggleTarget = document.querySelector(`#${clickBtn.dataset.toggleTargetId}`);
    const toggleGroup = clickBtn.dataset.toggleGroup;
    let expanded = clickBtn.getAttribute("aria-expanded") === "true" || false;

    // Close all group buttons
    if (toggleGroup) {
      toggleButtons
        .filter(btn => btn.dataset.toggleGroup === toggleGroup)
        .forEach(btn => {
        btn.setAttribute("aria-expanded", false);
        document.querySelector(`#${btn.dataset.toggleTargetId}`).hidden = true;
      });
    }

    // Open this'n
    clickBtn.setAttribute("aria-expanded", !expanded);
    toggleTarget.hidden = expanded;

  }
  toggleButtons.forEach(btn => btn.addEventListener("click", toggleIt));

  /** Support Control */
  document.querySelector("#openSupport")?.addEventListener("click", e => {
    document.querySelector("#chatContainer").classList.add("open");
  });


  /** Filters */
  const schedule = document.querySelector(".schedule");

  document.querySelectorAll("button[data-tag]").forEach(btn => btn.addEventListener("click", e => {

    document.querySelectorAll(".filter [aria-pressed='true']").forEach(btn => btn.setAttribute("aria-pressed", "false"));

    e.target.setAttribute("aria-pressed", "true");

    schedule.dataset.filter = e.target.dataset.tag;
  }));

  /** Platform checks */
  function cIsForCookie() {
    document.cookie = "ONCUE_hasCookies=true";
    if (!document.cookie.includes("ONCUE_hasCookies=true")) document.querySelector("#cookiesDisabledNote")?.removeAttribute("hidden");
  }
  if (!document.cookie.includes("ONCUE_hasCookies=true")) cIsForCookie();

  /** Vericode */
  const code = new URLSearchParams(window.location.search).get("v");
  if (code) localStorage.setItem("onCueV", code);
}