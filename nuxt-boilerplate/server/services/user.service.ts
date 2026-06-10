import bcrypt from 'bcrypt'
import { userRepository } from '../repositories/user.repository'
import { NotFoundError, ValidationError } from '../utils/errors'
import type { UpdateUserRequest, QueryParams } from '~/types'

const SALT_ROUNDS = 10

export const userService = {
  async findAll(params: QueryParams) {
    const [data, total] = await userRepository.findAll({
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search,
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

  async findById(id: string) {
    const user = await userRepository.findById(id)
    if (!user) {
      throw new NotFoundError('User')
    }
    return user
  },

  async update(id: string, input: UpdateUserRequest) {
    const existing = await userRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('User')
    }

    if (input.email) {
      const emailExists = await userRepository.findByEmail(input.email)
      if (emailExists && emailExists.id !== id) {
        throw new ValidationError('Email already in use')
      }
    }

    return userRepository.update(id, input)
  },

  async updatePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await userRepository.findByEmail(id)
    if (!user) {
      throw new NotFoundError('User')
    }

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      throw new ValidationError('Current password is incorrect')
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
    return userRepository.update(id, { password: hashedPassword })
  },

  async delete(id: string) {
    const user = await userRepository.findById(id)
    if (!user) {
      throw new NotFoundError('User')
    }
    await userRepository.delete(id)
  },
}
