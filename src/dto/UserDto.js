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

  static getUserResponseForRole = (user, role) => {
    switch (role) {
      case "admin":
        return {
          id: user._id,
          name: `${user.first_name} ${user.last_name}`,
          age: user.age,
          email: user.email,
          role: user.role,
          cartId: user.cartId,
          last_connection: user.last_connection,
          isOnline: user.isOnline,
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
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
      cartId: cart,
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
