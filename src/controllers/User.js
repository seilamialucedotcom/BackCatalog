import userService from '../services/User.js';

class UserController {
  async register(req, res, next) {
    try { return res.status(201).json(await userService.register(req.body)); } catch (error) { return next(error); }
  }
  async login(req, res, next) {
    try { return res.json(await userService.login(req.body)); } catch (error) { return next(error); }
  }
  async me(req, res, next) {
    try { return res.json({ user: await userService.getSession(req.user.id) }); } catch (error) { return next(error); }
  }
}

export default new UserController();
