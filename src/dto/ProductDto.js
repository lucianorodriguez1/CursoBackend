import moment from 'moment';

const formatDate = (date) => {
  return moment(date).format('DD/MM/YYYY HH:mm:ss');
};

export default class ProductDTO {
  constructor() {
  }
  //agregar fecha de creacion.
  static getProductResponseForRole = (product, role) => {
    switch (role) { 
      case "admin":
        return {
          id: product._id,
          title: product.title,
          description: product.description,
          code:product.code,
          price: product.price,
          status:product.status,
          stock: product.stock,
          category: product.category,
          owner: product.owner,
          created_data:formatDate(product.createdAt),
          update_data:formatDate(product.updatedAt),
        };
      default:
        return {
          id:product._id,
          title: product.title,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
          owner:product.owner,
          created_data:formatDate(product.createdAt),
        };
    }
  };
}
