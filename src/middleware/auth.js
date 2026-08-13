import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'cambia-esta-clave-en-produccion';

export function authMiddleware(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Se requiere un token de autenticación.' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: 'El token es inválido o expiró.' });
  }
}

export function adminMiddleware(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso restringido a administradores.' });
  }
  return next();
}

export default authMiddleware;
