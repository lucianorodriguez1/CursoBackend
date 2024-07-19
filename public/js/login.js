document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("error-message");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;
    let urlEndpoint = `/api/sessions/login`;
    try {
      const response = await fetch(urlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        window.location.href = "/";
      } else {
        throw new Error(data.message || "credenciales incorrectas");
      }
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });
});
