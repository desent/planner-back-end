import { Injectable } from '@nestjs/common';
import { startOfDay, subDays } from 'date-fns';
import { PrismaService } from 'src/prisma.service';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) {}

  async getCompletedTasksCount(userId: string) {
    return this.prismaService.task.count({
      where: {
        userId,
        isCompleted: true,
      },
    });
  }

  async getTodayTasksCount(userId: string) {
    const todayStart = startOfDay(new Date());
    return this.prismaService.task.count({
      where: {
        userId,
        createdAt: {
          gte: todayStart.toISOString(),
        },
      },
    });
  }

  async getWeekTasksCount(userId: string) {
    const weekStart = startOfDay(subDays(new Date(), 7));
    return this.prismaService.task.count({
      where: {
        userId,
        createdAt: {
          gte: weekStart.toISOString(),
        },
      },
    });
  }

  async getAll(userId: string) {
    return this.prismaService.task.findMany({
      where: {
        userId,
      },
    });
  }

  async create(dto: TaskDto, userId: string) {
    return this.prismaService.task.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async update(dto: Partial<TaskDto>, taskId: string, userId: string) {
    return this.prismaService.task.update({
      where: {
        userId,
        id: taskId,
      },
      data: dto,
    });
  }

  async delete(taskId: string) {
    return this.prismaService.task.delete({
      where: {
        id: taskId,
      },
    });
  }
}
