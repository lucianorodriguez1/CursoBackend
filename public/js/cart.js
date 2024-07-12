document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cartView');
    console.log("entre")
    cartButton.addEventListener('click', (e) => {
      e.preventDefault();
      let cartId = "tu_cart_id_aqui";
      fetch(`/carts/${cartId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("No estás autenticado o hubo un problema con la solicitud.");
        }
        return response.text();
      })
      .then((html) => {
        document.body.innerHTML = html;
      })
      .catch((error) => {
        console.error("Error:", error);
        window.location.href = "/not-available";
      });
    });
  });
  