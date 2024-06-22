export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getUsers() {
    let result = await this.dao.get();
    return result;
  }

  async createUser(user) {
    let result = await this.dao.create(user);
    return result;
  }

  async getUserById(id) {
    let result = await this.dao.getById(id);
    return result;
  }
  async getUserByEmail(email) {
    let result = await this.dao.getByEmail(email);
    return result;
  }
  async deleteUserById(id) {
    let result = await this.dao.delete(id);
    return result;
  }
  async updateUserById(id,data) {
    let result = await this.dao.update(id,data);
    return result;
  }
}
