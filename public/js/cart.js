let cartButton = document.getElementById("cartView");
let increaseQuanBtn = document.getElementById("increaseQuanBtn");
let decreaseQuanBtn = document.getElementById("decreaseQuanBtn");
let deleteProdToCart = document.getElementById("deleteProdToCart");

cartButton.addEventListener("click", async () => {
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
      window.location.href = "/login";
    } else {
      window.location.href = `/carts/${data.cartId}`;
    }
  } catch (error) {
    console.error("Error:", error);
    alert(
      "Hubo un problema al intentar acceder al carrito. Por favor, inténtalo de nuevo más tarde."
    );
  }
});

if (increaseQuanBtn) {
  increaseQuanBtn.addEventListener("click", async () => {
    const productId = increaseQuanBtn.getAttribute("data-product-id");
    let quantity = parseInt(increaseQuanBtn.getAttribute("data-quantity"), 10);
    const quantityUpdate = quantity + 1;
    try {
      const cartResponse = await fetch("/api/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!cartResponse.ok) {
        throw new Error("Error al obtener el carrito");
      }

      const data = await cartResponse.json();
      if (!data.error) {
        const cartId = data.cartId;
        const urlEndpoint = `/api/carts/${cartId}/product/${productId}`;
        const responseInc = await fetch(urlEndpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity:quantityUpdate }),

        });
        if (responseInc.ok) {
          const updatedCart = await responseInc.json();
        } else {
          console.log(responseInc);
          throw new Error("Error al actualizar la cantidad del producto");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Hubo un problema al intentar acceder al carrito. Por favor, inténtalo de nuevo más tarde."
      );
    }
  });
}
