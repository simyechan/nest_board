import { Boards } from 'src/board/board.entity';

export class findAllBoardDto {
  commentCount: number;

  repliesCount: number;

  board: Boards;
}
