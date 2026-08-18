import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        rol: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').map(c => c.trim());
      const tokenCookie = cookies.find(c => c.startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
    }

    if (!token) {
      res.status(401).json({ status: 'fail', message: 'No autenticado. Token no proporcionado' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'secret_dev';

    const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string; rol: string };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol,
    };

    next();
  } catch (error) {
    res.status(401).json({ status: 'fail', message: 'Token inválido o expirado' });
  }
};
