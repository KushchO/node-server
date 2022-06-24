import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ParsedQs } from 'qs'
import { IMiddleware } from './middleware.interface'
import { ClassConstructor, plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

export class ValidateMiddleware implements IMiddleware {
  constructor(private classToValidate: ClassConstructor<object>) {}
  execute({ body }: Request, res: Response, next: NextFunction): void {
    const instance = plainToClass(this.classToValidate, body)
    validate(instance).then((errors) => {
      console.log(errors)
      if (errors.length) {
        res.status(422).send(errors)
      } else {
        next()
      }
    })
  }
}
