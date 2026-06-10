import { prisma } from '../utils/prisma'
import type { Prisma } from '@prisma/client'

export const taskRepository = {
  findAll(params: {
    page: number
    limit: number
    userId?: string
    search?: string
    status?: string
    sort?: string
    order?: 'asc' | 'desc'
  }) {
    const { page, limit, userId, search, status, sort = 'createdAt', order = 'desc' } = params
    const skip = (page - 1) * limit

    const where: Prisma.TaskWhereInput = {}

    if (userId) {
      where.userId = userId
    }

    if (status) {
      where.status = status as Prisma.EnumTaskStatusFilter
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    return prisma.$transaction([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.task.count({ where }),
    ])
  },

  findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })
  },

  findByUserId(userId: string) {
    return prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  },

  create(data: Prisma.TaskCreateInput) {
    return prisma.task.create({
      data,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })
  },

  update(id: string, data: Prisma.TaskUpdateInput) {
    return prisma.task.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })
  },

  delete(id: string) {
    return prisma.task.delete({ where: { id } })
  },

  countByUser(userId: string) {
    return prisma.task.count({ where: { userId } })
  },
}
