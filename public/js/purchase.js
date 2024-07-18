document.addEventListener("DOMContentLoaded", function () {
  const purchaseBtn = document.getElementById("purchaseBtn");
  if (purchaseBtn) {
    purchaseBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        
        const response = await fetch("https://tu-backend.up.railway.app/api/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener el carrito");
        }
        const data = await response.json();
        const url = `https://tu-backend.up.railway.app/api/purchases/${data.cartId}`;
        const responsePurch = await fetch(
          url,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        const dataPurch = await responsePurch.json();

        if (responsePurch.ok) {
          alert("Se realizo la compra");
          location.reload();
        } else {
          throw new Error(dataPurch.message || "error en la compra");
        }
      } catch (error) {
        console.error("Error:", error);
        alert(
          "Hubo un problema al hacer la compra. Por favor, inténtalo de nuevo más tarde."
        );
      }
    });
  }
});
