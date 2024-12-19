const form = document.getElementById("input-form");
const outputDiv = document.getElementById("output");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const numberInput = document.getElementById("number-input").value;
  const N = parseInt(numberInput, 10);
  
  if (isNaN(N) || N < 1 || N > 1000) {
    alert("Please enter a valid number between 1 and 1000.");
    return;
  }
  
  // Hide the form and update the output div
  form.style.display = "none";
  outputDiv.innerHTML = "";

  for (let i = 1; i <= N; i++) {
    try {
      // Show the "Processing..." message while waiting
      if (i === 1) {
        outputDiv.innerHTML = "Processing...";
      }

      const response = await fetch("https://api.prod.jcloudify.com/whoami", {
        method: "GET",
      });

      // Remove "Processing..." if present
      if (i === 1) {
        outputDiv.innerHTML = "";
      }

      if (response.ok) {
        // Append "Forbidden" to the output div
        outputDiv.innerHTML += `<p>${i}. Forbidden</p>`;
      } else if (response.status === 403) {
        // Handle CAPTCHA encounter
        alert(
          "CAPTCHA encountered! Please solve it to continue. Reload the page after solving the CAPTCHA."
        );
        break;
      } else {
        // Handle other server errors
        outputDiv.innerHTML += `<p>${i}. Server Error: ${response.status}</p>`;
      }
    } catch (error) {
      // Log network errors or fetch failures
      console.error("Error during API call:", error);
      outputDiv.innerHTML += `<p>${i}. Network Error</p>`;
    }

    // Wait for 1 second before the next request
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
});
