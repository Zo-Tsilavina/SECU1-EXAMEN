const form = document.getElementById("input-form");
const outputDiv = document.getElementById("output");

let captchaResolver;

const token = "votre_token_d_authentification";

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const numberInput = document.getElementById("number-input").value;
  const N = parseInt(numberInput, 10);

  if (isNaN(N) || N < 1 || N > 1000) {
    alert("Please enter a valid number between 1 and 1000.");
    return;
  }

  form.style.display = "none";
  outputDiv.innerHTML = "";

  for (let i = 1; i <= N; i++) {
    try {
      const response = await fetch("https://api.prod.jcloudify.com/whoami", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        outputDiv.innerHTML += `<p>${i}. Success: ${JSON.stringify(data)}</p>`;
      } else if (response.status === 403) {
        alert("CAPTCHA encountered. Resolving...");
        await resolveCaptcha();
        i--;
      } else {
        outputDiv.innerHTML += `<p>${i}. Server Error: ${response.status}</p>`;
      }
    } catch (error) {
      console.error("Error during API call:", error);
      outputDiv.innerHTML += `<p>${i}. Network Error</p>`;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
});

async function resolveCaptcha() {
  return new Promise((resolve, reject) => {
    if (window.AWSCaptcha) {
      captchaResolver = window.AWSCaptcha.load({
        captchaId: "b82b1763d1c3",
        onSuccess: function () {
          alert("CAPTCHA solved successfully!");
          resolve();
        },
        onError: function (err) {
          alert("Error solving CAPTCHA. Please try again.");
          console.error("CAPTCHA Error:", err);
          reject(err);
        },
      });
    } else {
      alert("CAPTCHA script not loaded. Please check the integration.");
      reject("CAPTCHA script not loaded.");
    }
  });
}
