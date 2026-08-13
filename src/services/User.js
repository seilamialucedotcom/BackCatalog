import crypto from 'node:crypto';
import { promisify } from 'node:util';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/User.js';
import { JWT_SECRET } from '../middleware/auth.js';

const scrypt = promisify(crypto.scrypt);
const publicUser = ({ password, ...user }) => user;
const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = (await scrypt(password, salt, 64)).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

async function verifyPassword(password, stored) {
  const [algorithm, salt, hash] = String(stored).split('$');
  if (algorithm !== 'scrypt' || !salt || !hash) return false;
  const candidate = await scrypt(password, salt, 64);
  return crypto.timingSafeEqual(candidate, Buffer.from(hash, 'hex'));
}

class UserService {
  tokenFor(user) { return jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' }); }

  async register({ name, email, password }) {
    const cleanName = String(name || '').trim();
    const cleanEmail = normalizeEmail(email);
    if (!cleanName || !cleanEmail || String(password || '').length < 6) {
      const error = new Error('Nombre, correo y una contraseña de al menos 6 caracteres son obligatorios.');
      error.status = 400;
      throw error;
    }
    if (await userRepository.findByEmail(cleanEmail)) {
      const error = new Error('El correo electrónico ya está registrado.');
      error.status = 409;
      throw error;
    }
    const user = await userRepository.create({ name: cleanName, email: cleanEmail, password: await hashPassword(password) });
    const data = publicUser(user.get({ plain: true }));
    return { user: data, token: this.tokenFor(data) };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(normalizeEmail(email));
    if (!user || !(await verifyPassword(String(password || ''), user.password))) {
      const error = new Error('Correo o contraseña incorrectos.');
      error.status = 401;
      throw error;
    }
    const data = publicUser(user.get({ plain: true }));
    return { user: data, token: this.tokenFor(data) };
  }

  async getSession(id) {
    const user = await userRepository.findById(id);
    if (!user) { const error = new Error('Usuario no encontrado.'); error.status = 404; throw error; }
    return publicUser(user.get({ plain: true }));
  }
}

export default new UserService();
