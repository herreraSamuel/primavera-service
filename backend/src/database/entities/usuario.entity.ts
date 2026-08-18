import { prisma } from '../database.js';
import { Prisma } from '@prisma/client';

export class UsuarioEntity {
  static async findByEmail(email: string) {
    return prisma.usuario.findFirst({
      where: {
        email,
        deleted_at: null,
      },
    });
  }

  static async create(data: Prisma.UsuarioCreateInput) {
    return prisma.usuario.create({
      data,
    });
  }
}
