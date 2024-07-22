document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("error-message");

  const errorTranslations = {
    "Email cannot be empty": "El email no puede estar vacío",
    "Password cannot be empty": "La contraseña no puede estar vacía",
  };

  function translateError(error) {
    return errorTranslations[error] || error;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;
    try {
      const response = await fetch("/api/sessions/login", {
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
        let errorMsg = data.message || "Credenciales incorrectas";
        if (data.errors) {
      
          if (Array.isArray(data.errors)) {
            errorMsg = data.errors.map(translateError).join(", ");
          } else {
            errorMsg = translateError(data.errors);
          }
        }
        throw new Error(errorMsg);
      }
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });
});
