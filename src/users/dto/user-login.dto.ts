import { IsEmail, IsString, MinLength } from 'class-validator'

export class UserLoginDto {
  @IsEmail({}, { message: 'Неверно указан имейл' })
  email: string

  @IsString({ message: 'Не верно указан пароль' })
  @MinLength(8, { message: 'Пароль должен содеражить не менее 8 символов' })
  password: string
}
