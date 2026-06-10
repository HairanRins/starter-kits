import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, createTaskSchema, querySchema } from '../../server/utils/validation'

describe('loginSchema', () => {
  it('validates correct login input', () => {
    const result = loginSchema.parse({ email: 'test@example.com', password: 'password123' })
    expect(result.email).toBe('test@example.com')
    expect(result.password).toBe('password123')
  })

  it('rejects invalid email', () => {
    expect(() => loginSchema.parse({ email: 'invalid', password: 'password123' })).toThrow()
  })

  it('rejects empty password', () => {
    expect(() => loginSchema.parse({ email: 'test@example.com', password: '' })).toThrow()
  })
})

describe('registerSchema', () => {
  it('validates correct register input', () => {
    const result = registerSchema.parse({ name: 'Test User', email: 'test@example.com', password: 'password123' })
    expect(result.name).toBe('Test User')
  })

  it('rejects short password', () => {
    expect(() => registerSchema.parse({ name: 'Test', email: 'test@example.com', password: 'short' })).toThrow()
  })

  it('rejects short name', () => {
    expect(() => registerSchema.parse({ name: 'A', email: 'test@example.com', password: 'password123' })).toThrow()
  })
})

describe('createTaskSchema', () => {
  it('validates correct task input', () => {
    const result = createTaskSchema.parse({ title: 'Test task' })
    expect(result.title).toBe('Test task')
  })

  it('rejects empty title', () => {
    expect(() => createTaskSchema.parse({ title: '' })).toThrow()
  })

  it('accepts optional fields', () => {
    const result = createTaskSchema.parse({
      title: 'Test',
      description: 'Description',
      status: 'TODO',
    })
    expect(result.description).toBe('Description')
    expect(result.status).toBe('TODO')
  })
})

describe('querySchema', () => {
  it('provides defaults', () => {
    const result = querySchema.parse({})
    expect(result.page).toBe(1)
    expect(result.limit).toBe(10)
    expect(result.order).toBe('asc')
  })

  it('parses string numbers', () => {
    const result = querySchema.parse({ page: '2', limit: '20' })
    expect(result.page).toBe(2)
    expect(result.limit).toBe(20)
  })
})
