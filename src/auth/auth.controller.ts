import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/userDto';
import { AuthDto } from './dto/res/AuthDto';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
// import { AuthGuard } from './auth.guard';

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

  @Get('/test')
  @UseGuards(AuthGuard())
  test(@Req() request: Request) {
    console.log('user');
    return request.user;
  }
}
