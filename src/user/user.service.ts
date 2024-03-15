import { AuthDto } from './../auth/dto/auth.dto';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { hash } from 'argon2';


@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: AuthDto) {
    const user = {
      email: dto.email,
      password: await hash(dto.password),
    };

    return this.prismaService.user.create({
      data: user
    });
  }

  findAll() {
    return `This action returns all user`;
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

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
