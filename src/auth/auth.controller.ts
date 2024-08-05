import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './Dto/userDto';
import { AuthDto } from './Dto/res/AuthDto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() userDto: UserDto): Promise<void> {
    return this.authService.signUp(userDto);
  }

  @Post('/signin')
  async signIn(
    @Body() UserDto: UserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthDto> {
    return this.authService.signIn(UserDto, response);
  }
}
