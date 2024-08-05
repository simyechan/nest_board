import { Boards } from 'src/board/board.entity';

export class findBoardDto {
  commentCount: number;

  repliesCount: number;

  board: Boards;
}
