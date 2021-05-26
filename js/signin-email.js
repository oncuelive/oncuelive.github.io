"use strict";
{
  const urlParams = new URLSearchParams(window.location.search);
  const toPage = urlParams.get('path') || "/";

  let fails = 0;

  document.querySelector("#signin").addEventListener("submit", async e => {
    e.preventDefault();

    const form = e.target;
    const data = {
      eventName: form.dataset.eventName,
      submittedEmail: form.email.value,
      submittedEventId: localStorage.getItem("onCueV")
    };

    let res;

    // CHECK HONEYPOT

    form.dataset.status = "sending";

    res = await fetch("/.netlify/functions/auth-email", {
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

    if (!res) {
      if (fails > 0) {

        form.dataset.status = "fail";

        fetch("https://hooks.slack.com/services/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", {
          method: "POST",
          body: JSON.stringify({
            text: `${data.submittedEmail} is trying to sign in, but there's been a problem.`
          })
        });

      } else {
        form.dataset.status = "retry";
      }

      fails++;

    } else {
      const { isAttendee, isVerified } = res;

      if (isAttendee && isVerified) {
        window.localStorage.setItem("OnCue_info", JSON.stringify(res.info));
        window.location.href = `${toPage}`;
      } else if (isAttendee) {
        form.dataset.status = "unverified";
      } else {
        form.dataset.status = "rejected";
      }
    }
  });
}