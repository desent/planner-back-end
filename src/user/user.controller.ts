import { Controller, Get, Post, Body, Put, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import { Auth } from './../decorators/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: AuthDto) {
    return this.userService.create(dto);
  }

  @Get()
  @Auth()
  getProfile(@CurrentUser('id') id: string) {
    return this.userService.getProfile(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put()
  @Auth()
  update(@CurrentUser('id') id: string, @Body() dto: UserDto) {
    return this.userService.update(id, dto);
  }
}
