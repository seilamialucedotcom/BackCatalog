import User from '../models/User.js';

class UserRepository {
  findByEmail(email) { return User.findOne({ where: { email } }); }
  findById(id) { return User.findByPk(id); }
  create(data) { return User.create(data); }
}

export default new UserRepository();
