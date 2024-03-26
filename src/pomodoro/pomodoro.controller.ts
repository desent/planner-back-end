import {
  Controller,
  Delete,
  Get,
  Body,
  Put,
  UsePipes,
  ValidationPipe,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import { Auth } from './../decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';
import { PomodoroRoundDto, PomodoroSessionDto } from './dto/pomodoro.dto';

@Controller('user/timer')
export class PomodoroController {
  constructor(private readonly pomodoroService: PomodoroService) {}

  @Get('today')
  @Auth()
  getTodaySession(@CurrentUser('id') id: string) {
    return this.pomodoroService.getTodaySession(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async createPomodoroTimer(@CurrentUser('id') userId: string,) {
    return this.pomodoroService.create(userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('/round/:id')
  @Auth()
  async updateRound(@Param('id') id: string, @Body() dto: PomodoroRoundDto) {
    return this.pomodoroService.updateRound(dto, id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async update(
    @Param('id') id: string,
    @Body() dto: PomodoroSessionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.pomodoroService.updateSession(dto, id, userId);
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.pomodoroService.deleteSession(id, userId);
  }
}
