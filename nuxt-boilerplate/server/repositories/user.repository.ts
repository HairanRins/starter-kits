import { prisma } from '../utils/prisma'
import type { Prisma } from '@prisma/client'

export const userRepository = {
  findAll(params: { page: number; limit: number; search?: string; sort?: string; order?: 'asc' | 'desc' }) {
    const { page, limit, search, sort = 'createdAt', order = 'desc' } = params
    const skip = (page - 1) * limit

    const where: Prisma.UserWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    return prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
        select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true, updatedAt: true },
      }),
      prisma.user.count({ where }),
    ])
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true, updatedAt: true },
    })
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true, updatedAt: true },
    })
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true, updatedAt: true },
    })
  },

  delete(id: string) {
    return prisma.user.delete({ where: { id } })
  },
}
