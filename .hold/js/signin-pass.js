"use strict";
{
  const urlParams = new URLSearchParams(window.location.search);
  const toPage = urlParams.get('path') || "/";

  document.querySelector("#signin").addEventListener("submit", async e => {
    e.preventDefault();

    const form = e.target;
    const data = { password: form.password.value };

    // CHECK HONEYPOT

    form.dataset.status = "sending";

    const res = await fetch("/.netlify/functions/auth-pass", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(r => r.json())
    .catch(err => { console.log("ERRRR", err)});

    if (res.isValid) {

      window.location.href = toPage;

    } else {
      form.dataset.status = "invalid";
      alert("I'm sorry, that password is incorrect.");
    }

  });
}