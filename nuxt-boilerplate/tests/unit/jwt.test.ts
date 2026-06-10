import { describe, it, expect } from 'vitest'
import { generateToken, verifyToken } from '../../server/utils/jwt'

describe('JWT utils', () => {
  const payload = { userId: '123', email: 'test@example.com', role: 'USER' }

  it('generates and verifies a token', () => {
    const token = generateToken(payload)
    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')
  })

  it('verifies a valid token', () => {
    const token = generateToken(payload)
    const decoded = verifyToken(token)
    expect(decoded.userId).toBe('123')
    expect(decoded.email).toBe('test@example.com')
    expect(decoded.role).toBe('USER')
  })
})
