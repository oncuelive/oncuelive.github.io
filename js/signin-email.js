"use strict";
{
  const urlParams = new URLSearchParams(window.location.search);
  const toPage = urlParams.get('session');
  let fails = 0;

  document.querySelector("#signin").addEventListener("submit", async e => {
    e.preventDefault();

    const form = e.target;
    const data = {
      eventName: form.dataset.eventName,
      submittedEmail: form.email.value
    };

    let res;

    // CHECK HONEYPOT

    form.dataset.status = "sending";

    res = await fetch("/.netlify/functions/auth-reg", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(r => r.json())
    .catch(err => {
      console.log(err);
    });

    if (res && res.isAttendee) {

      window.location.href = toPage && toPage.includes("hls-testing")? "/hls-testing" : `/session/${toPage}`;

    } else if (res && res.isAttendee === false) {

      form.dataset.status = "rejected";

    } else {

      if (fails > 0) {

        form.dataset.status = "fail";

      } else {

        form.dataset.status = "retry";

      }

      fails++;
    }
  });
}