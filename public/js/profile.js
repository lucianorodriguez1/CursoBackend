let buttonLogout = document.getElementById("buttonLogout");

buttonLogout.addEventListener("click", (e) => {
  e.preventDefault();
  let urlEndpoint = "http://localhost:8080/api/sessions/logout";

  fetch(urlEndpoint, { method: "GET" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Hubo un problema al llamar al endpoint.");
      }
      window.location.href = response.url;
    })
    .catch((error) => {
      // Manejar errores de red o del servidor
      console.error("Error:", error);
      alert(
        "Hubo un problema al cerrar sesión. Por favor, inténtalo de nuevo más tarde."
      );
    });
});
