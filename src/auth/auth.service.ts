import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './Dto/userDto';
import { UserRepository } from 'src/user/user.repository';
import { User } from 'src/user/board.user-entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './Dto/res/AuthDto';
import { Response, response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(userDto: UserDto): Promise<void> {
    try {
      const { name, password } = userDto;
      const hashPassword = await bcrypt.hash(password, 10);

      const user = this.userRepository.create({
        name,
        password: hashPassword,
      });

      await this.userRepository.save(user);
    } catch (error) {
      console.error('회원가입 중 오류 발생', error);
    }
  }

  async signIn(userDto: UserDto, response: Response): Promise<AuthDto> {
    try {
      const user = await this.validateUser(userDto);
      const accessToken = await this.createAccessToken(user);
      const refreshToken = await this.createRefreshToken(user);

      if (response) {
        response.cookie('accessToken', accessToken, { httpOnly: true });
        response.cookie('refreshToken', refreshToken, { httpOnly: true });
      }

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('로그인 중 오류 발생', error);
    }
  }

  async refresh(name: string, refreshToken: string): Promise<AuthDto> {
    try {
      const user = await this.userRepository.findOne({ where: { name } });
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      const validRefreshTkn = await this.validateRefreshToken(
        user,
        refreshToken,
      );

      if (!validRefreshTkn) {
        throw new UnauthorizedException('리프레시 토큰이 유효하지 않습니다.');
      }

      const accessToken = await this.createAccessToken(user);

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('토큰 재발급 중 오류 발생', error);
    }
  }

  async validateUser(userDto: UserDto): Promise<User> {
    const { name, password } = userDto;

    try {
      const user = await this.userRepository.findOne({ where: { name } });

      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      if (!user.password) {
        throw new UnauthorizedException('비밀번호가 존재하지 않습니다.');
      }

      const pcompare = await bcrypt.compare(password, user.password);
      if (!pcompare) {
        throw new UnauthorizedException('비밀번호가 잘못되었습니다.');
      }

      return user;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      console.error('사용자 확인 중 오류 발생', error);
    }
  }

  async createAccessToken(user: User): Promise<string> {
    try {
      const payload = { name: user.name };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('SECRET_KEY'),
        expiresIn: parseInt(
          this.configService.get<string>('JWT_ACCESS_TOKEN_EXP'),
        ),
      });

      return accessToken;
    } catch (error) {
      console.error('액세스 토큰 생성 중 오류 발생', error);
    }
  }

  async createRefreshToken(user: User): Promise<string> {
    try {
      const payload = { name: user.name };
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('SECRET_KEY'),
        expiresIn: parseInt(
          this.configService.get<string>('JWT_REFRESH_TOKEN_EXP'),
        ),
      });

      return refreshToken;
    } catch (error) {
      console.error('리프레시 토큰 생성 중 오류 발생', error);
    }
  }

  async validateRefreshToken(
    user: User,
    refreshToken: string,
  ): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('SECRET_KEY'),
      });
      return payload.name === user.name;
    } catch (error) {
      console.error('토큰 확인 중 오류 발생', error);
    }
  }
}
