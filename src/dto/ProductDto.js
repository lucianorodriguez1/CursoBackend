export default class ProductDTO{
    constructor(product){
        this.title = product.title,
        this.description = product.description,
        this.code = product.code,
        this.price = product.price,
        this.status = product.status,
        this.stock = product.stock,
        this.category = product.category,
        this.thumbnail = product.thumbnail
    }
    //agregar fecha de creacion.
    static getProductResponseForRole = (product, role) => {
        switch (role) {
          case "admin":
            return {
              id: product._id,
              title: product.title,
            description: product.description,
              price: product.price,
              stock: product.stock,
              category: product.category,
                owner: product.owner
            };
          default:
            return {
                title: product.title,
              description: product.description,
                price: product.price,
                stock: product.stock,
                category: product.category,
            };
        }
      }; 

}

