import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Boards } from './board.entity';
import { BoardService } from './board.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { createBoardDto } from './dto/createBoard.dto';

@Controller('boards')
export class BoardsController {
  constructor(private boardService: BoardService) {}

  @Get()
  getAllBoard(): Promise<Boards[]> {
    return this.boardService.getAllBoard();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createBoard(
    @Body() createBoardDto: createBoardDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Boards> {
    console.log('업로드된 파일:', file);
    return this.boardService.createBoard(createBoardDto, file);
  }
}
