import { AuthDto } from './../auth/dto/auth.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { hash } from 'argon2';
import { UserDto } from './dto/user.dto';
import { TaskService } from 'src/task/task.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private taskService: TaskService,
  ) {}

  async create(dto: AuthDto) {
    const user = {
      email: dto.email,
      password: await hash(dto.password),
    };

    return this.prismaService.user.create({
      data: user,
    });
  }

  getById(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        tasks: true,
      },
    });
  }

  getByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(id: string, dto: UserDto) {
    let data = dto;
    if (dto.password) {
      data = { ...dto, password: await hash(dto.password) };
    }

    return this.prismaService.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async getProfile(id: string) {
    const profile = await this.getById(id);
    const totalTasks = profile.tasks.length;
    const completedTasks = await this.taskService.getCompletedTasksCount(id);
    const todayTasks = await this.taskService.getTodayTasksCount(id);
    const weekTasks = await this.taskService.getWeekTasksCount(id);
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { password, ...rest } = profile;

    return {
      user: rest,
      statistics: [
        { label: 'Total', value: totalTasks },
        { label: 'Completed tasks', value: completedTasks },
        { label: 'Today tasks', value: todayTasks },
        { label: 'Week tasks', value: weekTasks },
      ],
    };
  }
}
