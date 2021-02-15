"use strict";
{
  const urlParams = new URLSearchParams(window.location.search);
  const toPage = urlParams.get('req');
  const attemptedType = toPage.split("/")[1];

  let fails = 0;

  document.querySelector("#signin").addEventListener("submit", async e => {
    e.preventDefault();

    const form = e.target;
    const data = {
      eventName: form.dataset.eventName,
      submittedEmail: form.email.value,
      attemptedType
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

    if (res && res.isAttendee && res.correctPath) {
      if (_paq) _paq.push(['setUserId', data.submittedEmail]);
      if (localStorage) localStorage.setItem("matomoID", data.submittedEmail);

      window.location.href = `${toPage}`;

    } else if (res && res.isAttendee) {

      form.dataset.status = "wrong-role";

    } else if (res && res.isAttendee === false) {

      form.dataset.status = "rejected";

    } else {

      if (fails > 0) {

        form.dataset.status = "fail";

        fetch("https://hooks.slack.com/services/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", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: `${data.submittedEmail} is trying to sign in, but there's been a problem.`
          })
        });

      } else {

        form.dataset.status = "retry";

      }

      fails++;
    }
  });
}