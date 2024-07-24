document.addEventListener("DOMContentLoaded", () => {
  let addToCartBtn = document.getElementById("addToCartBtn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", async () => {
      const productId = addToCartBtn.getAttribute("data-product-id");
      try {
        const response = await fetch("/api/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener el carrito");
        }

        const data = await response.json();
        if (data.error) {
          window.location.href = "/not-available";
        } else {
          const cartId = data.cartId;
          const urlEndpoint = `/api/carts/${cartId}/product/${productId}`;

          const responseAdd = await fetch(urlEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          });

          if (!responseAdd.ok) {
            throw new Error("Error al agregar el producto al carrito");
          }

          alert("Producto agregado al carrito correctamente");
        }
      } catch (error) {
        console.error("Error:", error);
        alert(
          "Hubo un problema al agregar el producto al carrito. Por favor, inténtalo de nuevo más tarde."
        );
      }
    });
  }
});
