import { updateBoardDto } from '../req/updateBoard.dto';

export class createBoardDto {
  boardId: number;

  updateBoardDto: updateBoardDto;

  file: Express.Multer.File | undefined;
}
