import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './board.user-entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':userId')
  async mypage(
    @Param('userId') userId: string,
  ): Promise<{ user: User; boardCount: number; commentCount: number }> {
    return this.userService.mypage(userId);
  }

  @Get()
  async users(): Promise<User[]> {
    return this.userService.users();
  }
}
