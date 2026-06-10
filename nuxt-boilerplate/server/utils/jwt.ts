import jwt from 'jsonwebtoken'

export interface JwtPayload {
  userId: string
  email: string
  role: string
}

export function generateToken(payload: JwtPayload, secret?: string, expiresIn?: string): string {
  const jwtSecret = secret || process.env.JWT_SECRET || 'super-secret-key-change-in-production'
  const jwtExpiresIn = expiresIn || process.env.JWT_EXPIRES_IN || '7d'
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn } as jwt.SignOptions)
}

export function verifyToken(token: string, secret?: string): JwtPayload {
  const jwtSecret = secret || process.env.JWT_SECRET || 'super-secret-key-change-in-production'
  return jwt.verify(token, jwtSecret) as JwtPayload
}
