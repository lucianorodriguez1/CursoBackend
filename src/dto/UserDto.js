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
  static getUserResponseForCurrent = (user) => {
    return {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
    };
  };
}
