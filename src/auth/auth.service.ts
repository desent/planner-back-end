import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ){}

  async login(dto: AuthDto) {
    const { password, ...user } = await this.validateUser(dto);
    const tokens = this.issueTokens(user.id);

    return ({
      user,
      ...tokens,
    });
  }

    async register(dto: AuthDto) {

      const isUserExists = await this.userService.getByEmail(dto.email);

      if(isUserExists) throw new BadRequestException('User already exists');

      const { password, ...user } = await this.userService.create(dto);

      const tokens = this.issueTokens(user.id);

      return ({
        user,
        ...tokens,
      });
  }

  private issueTokens(userId: string) {
    const data = {id:userId};

    const accessToken = this.jwtService.sign(data, {
      expiresIn: '1h'
    });

    const refreshToken = this.jwtService.sign(data, {
      expiresIn: '7d'
    });

    return { accessToken, refreshToken };
  }

   private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email)

    if(!user) throw new NotFoundException('User not found');

    const isPasswordValid = await verify(user.password, dto.password);

    if(!isPasswordValid) throw new UnauthorizedException('Invalid password')

    return user;
   }
}
