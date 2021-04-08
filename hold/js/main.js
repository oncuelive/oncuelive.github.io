"use strict";
{
  function setScrollWatch() {
    let observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.body.classList.remove("scrolled");
        } else {
          document.body.classList.add("scrolled");
        }
      });
    });
    observer.observe(document.querySelector("header"));
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
}