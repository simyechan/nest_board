import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './board.user-entity';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { mypageReqDto } from './dto/req/mypage.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async mypage(
    @Req() req: Request
  ): Promise<mypageReqDto> {
    return this.userService.mypage(req);
  }

  @Get()
  async users(): Promise<User[]> {
    return this.userService.users();
  }
}
