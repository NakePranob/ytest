<template>
  <div>
    <h1>Login</h1>
    <form>
      <input placeholder="Username" required />
      <input type="password" placeholder="Password" required />
      <div id="captcha-container"></div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup>
function showMyCaptcha() {
  var container = document.querySelector("#captcha-container");

  AwsWafCaptcha.renderCaptcha(container, {
    apiKey: "ABHeoILFAWRZxShVkvcR1dkqY2z552DRP2ZuGW/1RhNe8BKbP8PVQQuJeaSF7iv5vt+pV1z/zbWLRrUGKuuMHbV3Bf8nx+pgiTbPMwyMVF84ROrLv9vXmf3YNOiZAw1oP5hWszx1xdtVQEySCrgdMAMhAJn0oEFB4nlnXZmTCSyHvCEKUPWcs+fqzJ0panTTx64K8raol5mH37RmRHRJF8jheNGcDptXob+x+5B0iVUfZtktdr6CeaJtEakWRRG06XAkumkzKjNpNaYezBqK8vt/n2s7qbBePEqp0uie+XEL8e1jLl2y11CQesDPEDNqZf0hjl96p9BnZP9ntjk747/ybLRqpzt1NPacZm3SFcmL9FjL/SthvhwfPVdcw0ff6r42iF6p9ekxLeFo2wZtSrJ/4F/i5w9jpaKKCWEzu6cNmyG2GZ+3JYvYJCqspPkxd1XEP4uRsBncZ7bGgtLigUL6JjG6syPjapKnqw4Qe+gO0MjtQr0T59AXvmw7NjNGS2Db9DxTuG08Z/KnFYqvx4fPP8apGSSRs0MG4pg3K8H6HCjHMgmXjuE8CfsfYRDETB8k8dy3MV4i0Ucw36Kx6lY5KViFOU/kGHeW4fuBpIm7MhhaJ0BFsKPof8/MBf+U7GY6132UypHkH1+WORrn893UBB5MHuw9OLM5HiTAkHg=_0_1",
    onSuccess: fetchWaeather,
    onError: captchaExampleErrorFunction,
    dynamicWidth: false,
    skipTitle: true,
    disableLanguageSelector: true,
  });
}

function fetchWaeather(wafToken) {
  console.log(wafToken);
  AwsWafCaptcha.fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ city: "London" }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

function captchaExampleErrorFunction(error) {
  console.error(error);
  /* Do something with the error */
}
onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://a2e68e46b9da.ap-southeast-1.captcha-sdk.awswaf.com/a2e68e46b9da/jsapi.js";
  script.type = "text/javascript";
  script.defer = true;
  script.onload = () => {
    showMyCaptcha();
  };
  document.head.appendChild(script);
  script.defer = true;
  document.head.appendChild(script);
});
</script>