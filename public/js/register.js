document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById("registerForm");
    const errorMessage = document.getElementById("error-message");

    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = {
        first_name: registerForm.first_name.value,
        last_name: registerForm.last_name.value,
        age: registerForm.age.value,
        email: registerForm.email.value,
        password: registerForm.password.value,
      };
  
      try {
        const response = await fetch("http://localhost:8080/api/sessions/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
            window.location.href = "/";
          } else {
            throw new Error(data.message || "email duplicado");
          }
        } catch (error) {
          errorMessage.textContent = error.message;
        }
    });
  });
  