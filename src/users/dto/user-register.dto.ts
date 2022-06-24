import { IsEmail, IsString, MinLength } from 'class-validator'

export class UserRegisterDto {
  @IsEmail({}, { message: 'Неверно указан имейл' })
  email: string

  @IsString({ message: 'Неверно указан пароль' })
  @MinLength(8, { message: 'Пароль должен содержать не менее 8 символов' })
  password: string

  @IsString({ message: 'Неверно указано имя' })
  name: string
}
