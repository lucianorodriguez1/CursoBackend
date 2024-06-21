import { usersRepository } from "../repositories/index.js";

class UserService {
  constructor() {}

  async getUsers() {
    let result = await usersRepository.getUsers();
    return result;
  }

  async createUser(user) {
    const passwordHash = createHash(user.password);
    const result = {
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      email: user.email,
      password: passwordHash,
    }
    return result;
  }

  async getUserById(id) {
    let result = await usersRepository.getUserById(id);
    return result;
  }

  async getUserByEmail(email) {
    let result = await usersRepository.getUserByEmail(email);
    return result;
  }
}

const usersServices = new UserService();
export default usersServices;
