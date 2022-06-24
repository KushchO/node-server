import { NextFunction, Request, Response } from 'express'
import { injectable } from 'inversify'
import { IMiddleware } from './middleware.interface'

@injectable()
export class GuardMiddleware implements IMiddleware {
  execute(req: Request, res: Response, next: NextFunction): void {
    if (req.user) {
      return next()
    }
    res.status(401).send({ error: 'Нет доступа на эту страницу' })
  }
}
