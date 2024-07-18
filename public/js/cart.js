let cartButton = document.getElementById("cartView");

cartButton.addEventListener("click", async () => {
  try {
    const response = await fetch("https://cursobackend-production-680d.up.railway.app/api/cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Error al obtener el carrito");
    }

    const data = await response.json();

    if (data.error) {
      window.location.href = "/login";
    } else {
      window.location.href = `/carts/${data.cartId}`;
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Hubo un problema al intentar acceder al carrito. Por favor, inténtalo de nuevo más tarde.");
  }
});


