import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsuarioEntity } from '../../database/entities/usuario.entity.js';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existingUser = await UsuarioEntity.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ status: 'fail', message: 'El usuario ya existe con este email' });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await UsuarioEntity.create({
      nombre,
      email,
      password: hashedPassword,
      ...(rol && { rol }),
    });

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado exitosamente',
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await UsuarioEntity.findByEmail(email);
    if (!user) {
      res.status(401).json({ status: 'fail', message: 'Credenciales inválidas' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ status: 'fail', message: 'Credenciales inválidas' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'secret_dev';
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      status: 'success',
      message: 'Inicio de sesión exitoso',
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      status: 'success',
      message: 'Sesión cerrada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

