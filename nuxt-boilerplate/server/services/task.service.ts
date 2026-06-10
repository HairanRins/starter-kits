import { taskRepository } from '../repositories/task.repository'
import { NotFoundError, ForbiddenError } from '../utils/errors'
import type { CreateTaskRequest, UpdateTaskRequest, QueryParams } from '~/types'
import type { Prisma, TaskStatus } from '@prisma/client'

export const taskService = {
  async findAll(params: QueryParams & { userId?: string }) {
    const [data, total] = await taskRepository.findAll({
      page: params.page || 1,
      limit: params.limit || 10,
      userId: params.userId,
      search: params.search,
      status: params.status,
      sort: params.sort,
      order: params.order,
    })

    return {
      data,
      total,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: Math.ceil(total / (params.limit || 10)),
    }
  },

  async findById(id: string, userId?: string) {
    const task = await taskRepository.findById(id)
    if (!task) {
      throw new NotFoundError('Task')
    }
    if (userId && task.userId !== userId) {
      throw new ForbiddenError('You do not have access to this task')
    }
    return task
  },

  async create(input: CreateTaskRequest, userId: string) {
    return taskRepository.create({
      title: input.title,
      description: input.description,
      status: input.status as TaskStatus,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      user: { connect: { id: userId } },
    })
  },

  async update(id: string, input: UpdateTaskRequest, userId: string) {
    const task = await taskRepository.findById(id)
    if (!task) {
      throw new NotFoundError('Task')
    }
    if (task.userId !== userId) {
      throw new ForbiddenError('You do not have access to this task')
    }

    const data: Prisma.TaskUpdateInput = {}
    if (input.title !== undefined) data.title = input.title
    if (input.description !== undefined) data.description = input.description
    if (input.status !== undefined) data.status = input.status
    if (input.dueDate !== undefined) {
      data.dueDate = input.dueDate ? new Date(input.dueDate) : null
    }

    return taskRepository.update(id, data)
  },

  async delete(id: string, userId: string) {
    const task = await taskRepository.findById(id)
    if (!task) {
      throw new NotFoundError('Task')
    }
    if (task.userId !== userId) {
      throw new ForbiddenError('You do not have access to this task')
    }
    await taskRepository.delete(id)
  },
}
