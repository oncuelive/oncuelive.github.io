{
  const breakout = document.querySelector("#breakoutFrame");
  const name = JSON.parse(localStorage.getItem("OnCue_info"))?.name;

  if (breakout && name) breakout.src = `${breakout.dataset.src}&displayName=${encodeURIComponent(name)}`;
  else breakout.src = breakout.dataset.src;

  setTimeout(() => breakout.classList.add("show"), 2000);

  document.querySelector("#toggleHelp")?.addEventListener("click", e => {
    document.querySelector("#openSupport").click();
    e.target.style.display = "none";
  });

}