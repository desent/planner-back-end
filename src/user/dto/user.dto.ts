import { IsNumber, IsEmail, IsOptional, IsString, IsStrongPassword, Max, Min } from "class-validator";

export class PomodoroSettingsDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  workInterval?: number

  @IsOptional()
  @IsNumber()
  @Min(1)
  breakInterval: number

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  intervalsCount?: number
}

export class UserDto extends PomodoroSettingsDto {
  @IsEmail()
  @IsOptional()
  email: string

  @IsString()
  @IsOptional()
  name?: string

  @IsStrongPassword({ minLength: 6 })
  @IsOptional()
  password: string
}