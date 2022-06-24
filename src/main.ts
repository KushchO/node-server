import { Container, ContainerModule, interfaces } from 'inversify'
import { App } from './app'
import { IExceptionFilter } from './errors/exception.filter.interface'
import { ExceptionFilter } from './errors/exception.filters'
import { ILogger } from './logger/logger.interface'
import { LoggerService } from './logger/logger.service'
import { TYPES } from './types'
import { IUserController } from './users/users.controller.interface'
import { UserController } from './users/users.controller'
import { IUserService } from './users/services/user.service.inreface'
import { UserService } from './users/services/users.service'
import { IConfigService } from './config/config.service.interface'
import { ConfigService } from './config/config.service'
import { PrismaService } from './database/prisma.service'
import { IUsersRepository } from './users/repository/users.reopsitory.interface'
import { UsersRepository } from './users/repository/users.repository'
import { GuardMiddleware } from './common/guard.middleware'

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope()
  bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope()
  bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope()
  bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope()
  bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope()
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope()
  bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope()
  bind<GuardMiddleware>(TYPES.GuardMiddleware).to(GuardMiddleware).inSingletonScope()
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
