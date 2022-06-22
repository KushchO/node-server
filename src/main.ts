import { Container, ContainerModule, interfaces } from 'inversify'
import { App } from './app'
import { IExceptionFilter } from './errors/exception.filter.interface'
import { ExceptionFilter } from './errors/exception.filters'
import { ILogger } from './logger/logger.interface'
import { LoggerService } from './logger/logger.service'
import { TYPES } from './types'
import { IUserController } from './users/users.controller.interface'
import { UserController } from './users/users.controller'

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService)
  bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter)
  bind<IUserController>(TYPES.UserController).to(UserController)
  bind<App>(TYPES.Aplication).to(App)
})

interface IBootstrapReturnType {
  appContainer: Container
  app: App
}

const bootstrap = (): IBootstrapReturnType => {
  const appContainer = new Container()
  appContainer.load(appBindings)
  const app = appContainer.get<App>(TYPES.Aplication)
  app.init()
  return { app, appContainer }
}

export const { app, appContainer } = bootstrap()
