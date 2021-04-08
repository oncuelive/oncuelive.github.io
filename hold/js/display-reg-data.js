"use strict";
{
  if (window.sessionStorage) {
    const store = sessionStorage.getItem("AHA_REG_DATA");

    if (store) {

      const regData = JSON.parse(store);

      document.querySelector(".post-register").classList.add("has-storage");

      for (const field in regData) {
        document.querySelectorAll(`[data-field="${field}"]`)?.
          forEach(span => {
            span.innerHTML = sanitizeString(regData[field]);
          });
      }
    }
  }

  function sanitizeString(str) {
    let temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  };
}