import { omit } from 'radash'

export class ExobaseError<TMetadata extends {} = {}> extends Error {
  metadata: Omit<TMetadata, 'key' | 'cause'>
  key: string
  status: number = 500
  cause?: Error
  constructor(
    message: string,
    metadata: TMetadata & {
      key: string
      cause?: Error
    }
  ) {
    super(message)
    this.cause = metadata.cause
    this.key = metadata.key
    this.metadata = omit(metadata, ['cause', 'key'])
  }
}

export class BadRequestError extends ExobaseError {
  status = 400
}

export class NotAuthenticatedError extends ExobaseError {
  status = 401
}

export class NotAuthorizedError extends ExobaseError {
  status = 403
}

export class RateLimitError extends ExobaseError {
  status = 429
}

export class InternalServerError extends ExobaseError {
  status = 500
}
