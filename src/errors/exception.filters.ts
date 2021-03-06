import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { ILogger } from '../logger/logger.interface'
import { TYPES } from '../types'
import { IExceptionFilter } from './exception.filter.interface'
import { HTTPError } from './http-error.class'
import 'reflect-metadata'

@injectable()
export class ExceptionFilter implements IExceptionFilter {
  constructor(@inject(TYPES.ILogger) private logger: ILogger) {}
  catch(error: Error, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof HTTPError) {
      this.logger.error(`[${error.context}] Ошибка ${error.statusCode} ${error.message}`)
      res.status(error.statusCode).send({ err: error.message })
    } else {
      this.logger.error(error.message)
      res.status(500).send({ err: error.message })
    }
  }
}
