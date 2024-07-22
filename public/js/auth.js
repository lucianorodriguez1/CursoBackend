document.addEventListener("DOMContentLoaded", async function () {
  const authLink = document.getElementById("authLink");
  try {
    const response = await fetch("/api/sessions/current", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();

      if (data) {
        authLink.textContent = "Profile";
        authLink.href = "/profile";
      }
    } else if (response.status == 401) {
      authLink.textContent = "Login";
      authLink.href = "/login";
    }else{
      console.error(`Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error verifying authentication status:", error);
  }
});
