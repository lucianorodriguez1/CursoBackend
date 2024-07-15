export const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * title : needs to be a String, received ${product.title}
    * description  : needs to be a String, received ${product.description}
    * code      : needs to be a String, received ${product.code}
    * price      : needs to be a String, received ${product.price}
    * status      : needs to be a String, received ${product.status}
    * stock     : needs to be a String, received ${product.stock}
    * category      : needs to be a String, received ${product.category}
    * thumbnails      : needs to be a String, received ${product.thumbnails}`;
}