import { createError } from 'h3'
import type { ZodError } from 'zod'

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403)
    this.name = 'ForbiddenError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400)
    this.name = 'ValidationError'
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return createError({
      statusCode: error.statusCode,
      statusMessage: error.message,
    })
  }

  if (error instanceof Error) {
    console.error('Unhandled error:', error)
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }

  return createError({
    statusCode: 500,
    statusMessage: 'Internal server error',
  })
}

export function isZodError(error: unknown): error is ZodError {
  return error instanceof Error && 'issues' in error
}

export function formatZodError(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }))
}
