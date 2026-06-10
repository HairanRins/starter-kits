import bcrypt from 'bcrypt'
import { userRepository } from '../repositories/user.repository'
import { generateToken } from '../utils/jwt'
import { UnauthorizedError, ValidationError } from '../utils/errors'
import type { LoginRequest, RegisterRequest, AuthResponse } from '~/types'

const SALT_ROUNDS = 10

export const authService = {
  async login(input: LoginRequest): Promise<AuthResponse & { token: string }> {
    const user = await userRepository.findByEmail(input.email)

    if (!user) {
      throw new UnauthorizedError('Invalid email or password')
    }

    const isValid = await bcrypt.compare(input.password, user.password)

    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password')
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const { password: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword, token }
  },

  async register(input: RegisterRequest): Promise<AuthResponse & { token: string }> {
    const existing = await userRepository.findByEmail(input.email)

    if (existing) {
      throw new ValidationError('Email already in use')
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS)

    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    })

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return { user, token }
  },

  async getMe(userId: string): Promise<AuthResponse> {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw new UnauthorizedError('User not found')
    }

    return { user }
  },
}
