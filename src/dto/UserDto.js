import cartService from "../services/CartService.js";
import CartDTO from "./CartDto.js";

export default class UserDTO {
  static getUserTokenFrom = (user) => {
    return {
      name: `${user.first_name} ${user.last_name}`,
      role: user.role,
      email: user.email,
    };
  };

  static getUserResponseForRole = async (user, role) => {
    const cart = await cartService.getCartById(user.cartId, user.role);
    switch (role) {
      case "admin":
        return {
          id: user._id,
          name: `${user.first_name} ${user.last_name}`,
          age: user.age,
          email: user.email,
          role: user.role,
          cart: cart,
          last_connection: user.last_connection,
          isOnline: user.isOnline,
          documents:
<<<<<<< HEAD
          user.documents.length > 0
            ? user.documents.map((doc) => ({
                name: doc.name,
                reference: doc.reference,
              }))
            : "No hay documentos",
=======
            user.documents.length > 0
              ? user.documents.map((doc) => ({
                name: doc.name,
                reference: doc.reference,
              }))
              : "No hay documentos",
>>>>>>> ce32084a3478323326ffca1f3d8b9b77dbd32258
        };
      case "premium":
        return {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          last_connection: user.last_connection,
          isOnline: user.isOnline,
          role: user.role,
        };
      case "user":
        return {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          last_connection: user.last_connection,
          isOnline: user.isOnline,
        };
      default:
        return {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
        };
    }
  };
  static getUserResponseForCurrent = async (user) => {
    const cart = await cartService.getCartById(user.cartId, user.role);
    return {
      id:user._id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
      cart: cart,
      documents:
        user.documents.length > 0
          ? user.documents.map((doc) => ({
            name: doc.name,
            reference: doc.reference,
          }))
          : "No hay documentos",
    };
  };
}
