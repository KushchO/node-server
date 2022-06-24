import { BaseController } from '../common/base.controller'
import { NextFunction, Request, Response } from 'express'
import { HTTPError } from '../errors/http-error.class'
import { inject, injectable } from 'inversify'
import { ILogger } from '../logger/logger.interface'
import { TYPES } from '../types'
import 'reflect-metadata'
import { IUserController } from './users.controller.interface'
import { UserLoginDto } from './dto/user-login.dto'
import { UserRegisterDto } from './dto/user-register.dto'
import { UserService } from './services/users.service'
import { ValidateMiddleware } from '../common/validate.middleware'
import { sign } from 'jsonwebtoken'
import { ConfigService } from '../config/config.service'
import { AuthMiddleware } from '../common/auth.middleware'
import { GuardMiddleware } from '../common/guard.middleware'

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.ConfigService) private configService: ConfigService,
    @inject(TYPES.GuardMiddleware) private guardMiddleware: GuardMiddleware,
  ) {
    super(loggerService)
    this.bindRoutes([
      {
        path: '/register',
        method: 'post',
        func: this.register,
        middlewares: [new ValidateMiddleware(UserRegisterDto)],
      },
      {
        path: '/login',
        method: 'post',
        func: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
      {
        path: '/info',
        method: 'get',
        func: this.info,
        middlewares: [this.guardMiddleware],
      },
    ])
  }

  async login(
    { body }: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.userService.validateUser(body)
    if (!result) {
      return next(new HTTPError(401, 'Пароль или логин не верны'))
    }
    const jwt = await this.signJWT(body.email, this.configService.get('SECRET'))
    this.ok(res, { message: 'Логин прошел успешно', jwt })
  }
  async register(
    { body }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this?.userService.createUser(body)
    if (!result) {
      return next(new HTTPError(422, 'Такой пользователь уже существует'))
    }
    this.ok(res, { email: result.email, id: result.id })
  }

  async info(
    { user }: Request<{}, {}, UserRegisterDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    if (user) {
      const resultUser = await this.userService.info(user)
      if (resultUser) {
        this.ok(res, { email: user, id: resultUser.id, name: resultUser.name })
      }
    }
  }

  private async signJWT(email: string, secret: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sign(
        {
          email,
          iat: Math.floor(Date.now() / 1000),
        },
        secret,
        {
          algorithm: 'HS256',
        },
        (error, token) => {
          if (error) {
            reject(error)
          }
          resolve(token as string)
        },
      )
    })
  }
}
