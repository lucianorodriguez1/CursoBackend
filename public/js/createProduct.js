document.addEventListener("DOMContentLoaded", function () {
  const productForm = document.getElementById("productForm");
  const errorMessage = document.getElementById("error-message");

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(productForm);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert("Se creo el producto");
        location.reload();
      } else {
        console.log(data);
        throw new Error("error al subir el producto");
      }
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });
});
