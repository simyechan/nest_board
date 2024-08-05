import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './board.user-entity';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async mypage(
    @Req() req: Request
  ): Promise<{ user: User; boardCount: number; commentCount: number }> {
    return this.userService.mypage(req);
  }

  @Get()
  async users(): Promise<User[]> {
    return this.userService.users();
  }
}
