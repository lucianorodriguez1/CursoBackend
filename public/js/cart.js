let cartButton = document.getElementById("cartView");

cartButton.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/cart", {
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
      // Manejar el caso de que el usuario no esté autenticado
      window.location.href = "/not-available";
    } else {
      // Redirigir al usuario al carrito
      window.location.href = `/carts/${data.cartId}`;
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Hubo un problema al intentar acceder al carrito. Por favor, inténtalo de nuevo más tarde.");
  }
});


