import { verifyToken, type JwtPayload } from '../utils/jwt'
import { UnauthorizedError } from '../utils/errors'

declare module 'h3' {
  interface H3EventContext {
    auth: JwtPayload
  }
}

export default defineEventHandler(async (event) => {
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/health',
  ]

  if (publicRoutes.some(route => getRequestURL(event).pathname.startsWith(route))) {
    return
  }

  if (!getRequestURL(event).pathname.startsWith('/api')) {
    return
  }

  const token = getCookie(event, 'auth_token')

  if (!token) {
    const authHeader = getHeader(event, 'authorization')
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!bearerToken) {
      throw new UnauthorizedError('No authentication token provided')
    }

    try {
      const payload = verifyToken(bearerToken)
      event.context.auth = payload
    } catch {
      throw new UnauthorizedError('Invalid or expired token')
    }
  } else {
    try {
      const payload = verifyToken(token)
      event.context.auth = payload
    } catch {
      throw new UnauthorizedError('Invalid or expired token')
    }
  }
})
