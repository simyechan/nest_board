import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Boards } from './board.entity';
import { BoardService } from './board.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { createBoardDto } from './dto/req/createBoard.dto';
import { updateBoardDto } from './dto/req/updateBoard.dto';
import { Reply } from 'src/reply/reply.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('boards')
export class BoardsController {
  constructor(private boardService: BoardService) {}

  @Get()
  async findAll(): Promise<{ board: Boards; commentCount: number }[]> {
    return this.boardService.findAll();
  }

  @Get(':boardId')
  async find(@Param('boardId') boardId: number): Promise<{
    board: Boards;
    commentCount: number;
    replies: Reply[];
    repliesCount: number;
  }> {
    return this.boardService.find(boardId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createBoardDto: createBoardDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Boards> {
    return this.boardService.create(createBoardDto, req, file);
  }

  @Delete(':boardId')
  @UseGuards(AuthGuard('jwt'))
  async delete(
    @Param('boardId') boardId: number,
    @Req() req: Request,
  ): Promise<void> {
    this.boardService.delete(boardId, req);
  }

  @Patch(':boardId')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('boardId') boardId: number,
    @Body() updateBoardDto: updateBoardDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<Boards> {
    return this.boardService.update(boardId, updateBoardDto, req, file);
  }
}
