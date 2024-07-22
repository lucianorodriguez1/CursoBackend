document.addEventListener("DOMContentLoaded", function () {
  const productForm = document.getElementById("productForm");
  const errorMessage = document.getElementById("error-message");
  const successMessage = document.getElementById("success-message");

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
        successMessage.textContent = "Producto subido con éxito.";
        productForm.reset();
      } else {
        console.log("error");
        console.log(data);
        throw new Error("error al subir el producto");
      }
    } catch (error) {
      console.log(error);
      errorMessage.textContent = error.message;
    }
  });
});
