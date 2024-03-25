import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TimeBlockDto } from './dto/time-block.dto';

@Injectable()
export class TimeBlockService {
  constructor(private prismaService: PrismaService) {}

  async getAll(userId: string) {
    return this.prismaService.timeBlock.findMany({
      where: {
        userId,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async create(dto: TimeBlockDto, userId: string) {
    return this.prismaService.timeBlock.create({
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

  async update(
    dto: Partial<TimeBlockDto>,
    timeBlockId: string,
    userId: string,
  ) {
    return this.prismaService.timeBlock.update({
      where: {
        userId,
        id: timeBlockId,
      },
      data: dto,
    });
  }

  async updateOrder(ids: string[]) {
    return this.prismaService.$transaction(
      ids.map((id, order) =>
        this.prismaService.timeBlock.update({
          where: { id },
          data: { order },
        }),
      ),
    );
  }

  async delete(timeBlockId: string) {
    return this.prismaService.timeBlock.delete({
      where: {
        id: timeBlockId,
      },
    });
  }
}
