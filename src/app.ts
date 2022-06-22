import express, { Express } from 'express'
import { Server } from 'http'
import { inject, injectable } from 'inversify'
import { ExceptionFilter } from './errors/exception.filters'
import { ILogger } from './logger/logger.interface'
import { LoggerService } from './logger/logger.service'
import { TYPES } from './types'
import 'reflect-metadata'
import { IUserController } from './users/users.controller.interface'

@injectable()
class App {
  app: Express
  port: number
  server: Server

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.UserController) private userController: IUserController,
    @inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
  ) {
    this.app = express()
    this.port = 8000
    this.logger = new LoggerService()
    this.userController = userController
    this.exceptionFilter = exceptionFilter
  }

  useRoutes(): void {
    this.app.use('/users', this.userController.router)
  }

  useExсeptionFilters(): void {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
  }

  public async init(): Promise<void> {
    this.useRoutes()
    this.useExсeptionFilters()
    this.server = this.app.listen(this.port)
    this.logger.log(`Сервер запущен на http://localhost:${this.port}`)
  }
}

export { App }
