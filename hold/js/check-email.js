"use strict";
{
  const gate = document.querySelector("#gate");

  document.querySelector("#checkEmail").addEventListener("submit", async e => {
    e.preventDefault();

    document.querySelector("#register").reset();

    const form = e.target;
    const data = { email: form.email.value };

    // CHECK HONEYPOT

    form.dataset.status = "sending";

    const res = await fetch("/.netlify/functions/check-email", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(r => r.json())
    .catch(err => console.log(err));

    const fields = document.querySelector("#register").elements;

    if (res && res.foundEm) {

      for (const prop in res.info) {
        if (fields[prop]) fields[prop].value = res.info[prop];
      }

      gate.dataset.status = "preVet";

    } else {

      fields.Email.value = sanitizeString(data.email);

      gate.dataset.status = "noVet";
    }
  });

  function sanitizeString(str) {
    let temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  };
}