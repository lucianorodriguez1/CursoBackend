import UserDTO from "../dao/DTO/user.dto.js";

export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getUsers() {
    let result = await this.dao.get();
    return result;
  }

  async createUser(user) {
    let userToInsert = new UserDTO(user);
    let result = await this.dao.create(userToInsert);
    return result;
  }

  async getUserById(id) {
    let result = await this.dao.getById(id);
    return result;
  }
  async getUserByEmail(email) {
    let result = await this.dao.getByEmail(id);
    return result;
  }
  async updateProductById(id, data) {
    let result = await this.dao.update(id, data);
    return result;
  }
  async deleteProductById(id) {
    let result = await this.dao.delete(id);
    return result;
  }
}
