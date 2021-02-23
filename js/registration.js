"use strict";
{

  let fails = 0;

  document.querySelector("#register").addEventListener("submit", async e => {
    e.preventDefault();

    const form = e.target;
    // const isVetted = document.querySelector("#gate").dataset.status === "preVet";

    let data = {
      // isVetted,
      registrationData: {},
      eventName: form.dataset.eventName,
      eventDates: form.dataset.eventDates,
      eventURL: window.location.origin
    };

    [...form.elements].forEach(input => {
      if (input.nodeName !== "BUTTON" && input.name !== "lamp") {
        data.registrationData[input.name] = input.value;
      }
    });

    data.registrationData["Date"] = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});

    // CHECK HONEYPOT

    form.dataset.status = "sending";

    const res = await fetch("/.netlify/functions/register", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(r => r.json())
    .catch(err => { console.log("ERRRR", err)});

    if (res && res.fsGo) {

      // Do other stuff if confirmGo/contactGo is false?

      form.dataset.status = "sent";

      // Store reg data for display on confirmation page
      if (window.sessionStorage) sessionStorage.setItem("AHA_REG_DATA", JSON.stringify(data.registrationData));

      if (res.isPreapproved) window.location.href = "/confirmed";
      else window.location.href = "/thank-you";

    } else {

      if (fails > 1) {

        alert(`Sorry about this. The team has been alerted, and you'll recieve a follow up at ${data.registrationData.EMAIL}`);

      } else {
        alert("Hmm. There's been a problem. Please try again.");
      }

      form.dataset.status = "error";
      fails++;
    }

  });

  // const workRadio = document.querySelector("#workRadio");
  // const conditionalInputs = document.querySelectorAll("[data-condition] input");

  // if (workRadio) document.querySelectorAll(".work-radio input").forEach(radio => radio.addEventListener("click", e => {
  //   const el = e.target;

  //   workRadio.dataset.value = el.value;

  //   disableInputs(conditionalInputs);

  //   Array.from(conditionalInputs).filter(input => input.parentNode.dataset.condition === el.value).forEach(input => input.removeAttribute("disabled"));
  // }));

  // function disableInputs(inputs = []) {
  //   inputs.forEach(input => input.disabled = true);
  // }
}