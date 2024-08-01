import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Boards } from './board.entity';
import { BoardService } from './board.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { createBoardDto } from './dto/req/createBoard.dto';
import { updateBoardDto } from './dto/req/updateBoard.dto';

@Controller('boards')
export class BoardsController {
  constructor(private boardService: BoardService) {}

  @Get()
  async findAll(): Promise<{ board: Boards; commentCount: number }[]> {
    return this.boardService.findAll();
  }

  @Get(':boardId')
  async find(
    @Param('boardId') boardId: number,
  ): Promise<{ board: Boards; commentCount: number }> {
    return this.boardService.find(boardId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createBoardDto: createBoardDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Boards> {
    return this.boardService.create(createBoardDto, file);
  }

  @Delete(':boardId')
  async delete(@Param('boardId') boardId: number): Promise<void> {
    this.boardService.delete(boardId);
  }

  @Patch(':boardId')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('boardId') boardId: number,
    @Body() updateBoardDto: updateBoardDto,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<Boards> {
    return this.boardService.update(boardId, updateBoardDto, file);
  }
}
