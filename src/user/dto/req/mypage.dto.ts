import { User } from 'src/user/board.user-entity';

export class mypageReqDto {
  user: User;

  boardCount: number;
  
  commentCount: number;
}
