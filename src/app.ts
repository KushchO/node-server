import express, { Express } from "express"
import { Server } from "http"
import { ExceptionFilter } from "./errors/exception.filters"
import { ILogger } from './logger/logger.interface'
import { LoggerService } from "./logger/logger.service"
import { UserController } from "./users/users.controller"

export class App {
  app: Express
  port: number
  server: Server
  logger: ILogger
  userController: UserController
  exceptionFilter: ExceptionFilter

  constructor(
    logger: ILogger,
    userController: UserController,
    exceptionFilter: ExceptionFilter
  ) {
    this.app = express()
    this.port = 8000
    this.logger = new LoggerService()
    this.userController = userController
    this.exceptionFilter = exceptionFilter
  }

  useRoutes() {
    this.app.use("/users", this.userController.router)
  }

  useExсeptionFilters() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
  }

  public async init() {
    this.useRoutes()
    this.useExсeptionFilters()
    this.server = this.app.listen(this.port)
    this.logger.log(`Сервер запущен на http://localhost:${this.port}`)
  }
}
