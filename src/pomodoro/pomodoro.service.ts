import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { PomodoroRoundDto, PomodoroSessionDto } from './dto/pomodoro.dto';

@Injectable()
export class PomodoroService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  async getTodaySession(userId: string) {
    const today = new Date().toISOString().split('T')[0];

    return this.prismaService.pomodoroSession.findFirst({
      where: {
        createdAt: {
          gte: new Date(today),
        },
        userId,
      },
      include: {
        rounds: {
          orderBy: {
            id: 'desc',
          },
        },
      },
    });
  }

  async create(userId: string) {
    const todaySession = await this.getTodaySession(userId);

    if (todaySession) return todaySession;

    const { intervalsCount } =
      await this.userService.getUserIntervalCount(userId);

    if (intervalsCount) throw new NotFoundException('User not found');

    return this.prismaService.pomodoroSession.create({
      data: {
        rounds: {
          createMany: {
            data: Array.from({ length: intervalsCount }, () => ({
              totalSeconds: 0,
            })),
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        rounds: true,
      },
    });
  }

  async updateSession(
    dto: Partial<PomodoroSessionDto>,
    pomodoroId: string,
    userId: string,
  ) {
    return this.prismaService.pomodoroSession.update({
      where: {
        id: pomodoroId,
        userId,
      },
      data: dto,
    });
  }

  async updateRound(dto: Partial<PomodoroRoundDto>, roundId: string) {
    return this.prismaService.pomodoroRound.update({
      where: {
        id: roundId,
      },
      data: dto,
    });
  }

  async deleteSession(sessionId: string, userId: string) {
    return this.prismaService.pomodoroSession.delete({
      where: {
        id: sessionId,
        userId,
      },
    });
  }
}
