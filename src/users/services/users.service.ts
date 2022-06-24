import { inject, injectable } from 'inversify'
import { UserLoginDto } from '../dto/user-login.dto'
import { UserRegisterDto } from '../dto/user-register.dto'
import { User } from './user.entity'
import { IUserService } from './user.service.inreface'
import 'reflect-metadata'
import { TYPES } from '../../types'
import { ConfigService } from '../../config/config.service'
import { UsersRepository } from '../repository/users.repository'
import { UserModel } from '@prisma/client'
import { compare } from 'bcryptjs'

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.ConfigService) private configService: ConfigService,
    @inject(TYPES.UsersRepository) private UserRepository: UsersRepository,
  ) {}
  async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
    const newUser = new User(email, name)
    const salt = Number(this.configService.get<number>('SALT'))
    await newUser.setPassword(password, salt)
    const existedUser = await this.UserRepository.find(email)
    if (existedUser) {
      return null
    }

    return await this.UserRepository.create(newUser)
  }

  async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
    const user = await this.UserRepository.find(email)
    if (user) {
      return await compare(password, user.password)
    }
    return false
  }

  async info(email: string): Promise<UserModel | null> {
    return await this.UserRepository.find(email)
  }
}
