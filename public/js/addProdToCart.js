document.addEventListener("DOMContentLoaded", () => {
  let addToCartBtn = document.getElementById("addToCartBtn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", async () => {
      const productId = addToCartBtn.getAttribute("data-product-id");
      try {

        const response = await fetch("https://cursobackend-production-680d.up.railway.app/api/cart", {
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
          // Manejar el caso de que el usuario no esté autenticado
          window.location.href = "/not-available";
        } else {
          const cartId = data.cartId;
          const urlEndpoint = `https://cursobackend-production-680d.up.railway.app/api/carts/${cartId}/product/${productId}`;


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
