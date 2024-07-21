let cartButton = document.getElementById("cartView");

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


let increaseQuanBtn = document.getElementById("increaseQuanBtn");
let decreaseQuanBtn = document.getElementById("decreaseQuanBtn");
let deleteProdToCart = document.getElementById("deleteProdToCart");
let stockProd = document.getElementById("stockProd");
let quantProd = document.getElementById("quantProd");


if (increaseQuanBtn) {
  increaseQuanBtn.addEventListener("click", async () => {
    const productId = increaseQuanBtn.getAttribute("data-product-id");
    let quantity = parseInt(increaseQuanBtn.getAttribute("data-quantity"), 10);
    const stock = parseInt(stockProd.getAttribute("data-stock"), 10);
    const quantityUpdate = quantity + 1;

    if (quantity < stock) {
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
            body: JSON.stringify({ quantity: quantityUpdate }),
          });
          if (responseInc.ok) {
            increaseQuanBtn.setAttribute("data-quantity", quantityUpdate);
            quantProd.textContent = `Quantity: ${quantityUpdate}`;
            quantProd.setAttribute("data-quant", quantityUpdate);

            if (quantityUpdate === stock) {
              increaseQuanBtn.disabled = true;
            }
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
    }
  });
}

if (decreaseQuanBtn) {
  decreaseQuanBtn.addEventListener("click", async () => {
    const productId = decreaseQuanBtn.getAttribute("data-product-id");
    let quantity = parseInt(decreaseQuanBtn.getAttribute("data-quantity"), 10);

    if (quantity > 1) {
      const quantityUpdate = quantity - 1;
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
          const responseDec = await fetch(urlEndpoint, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: quantityUpdate }),
          });
          if (responseDec.ok) {
            decreaseQuanBtn.setAttribute("data-quantity", quantityUpdate);
            quantProd.textContent = `Quantity: ${quantityUpdate}`;
            quantProd.setAttribute("data-quant", quantityUpdate);

            if (increaseQuanBtn.disabled) {
              increaseQuanBtn.disabled = false;
            }
          } else {
            console.log(responseDec);
            throw new Error("Error al actualizar la cantidad del producto");
          }
        }
      } catch (error) {
        console.error("Error:", error);
        alert(
          "Hubo un problema al intentar acceder al carrito. Por favor, inténtalo de nuevo más tarde."
        );
      }
    }
  });
}

if (deleteProdToCart) {
  deleteProdToCart.addEventListener("click", async () => {
    const productId = deleteProdToCart.getAttribute("data-product-id");
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
        const responseDel = await fetch(urlEndpoint, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (responseDel.ok) {
          deleteProdToCart.closest("div").remove();
        } else {
          console.log(responseDel);
          throw new Error("Error al eliminar el producto del carrito");
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
