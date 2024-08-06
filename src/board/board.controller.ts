import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Boards } from './board.entity';
import { BoardService } from './board.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReqBoardDto } from './dto/req/createBoard.dto';
import { updateReqBoardDto } from './dto/req/updateBoard.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { updateResBoardDto } from './dto/res/updateBoard.dto';
import { findBoardDto } from './dto/res/findAllBoard.dto';

@Controller('boards')
export class BoardsController {
  constructor(private boardService: BoardService) {}

  @Get()
  async findAll(): Promise<findBoardDto[]> {
    return this.boardService.findAll();
  }

  @Get('/find/:boardId')
  async find(@Param('boardId') boardId: number): Promise<findBoardDto> {
    return this.boardService.find(boardId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createBoardDto: createReqBoardDto,
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
    @Body() updateReqBoardDto: updateReqBoardDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<updateResBoardDto> {
    return this.boardService.update(boardId, updateReqBoardDto, req, file);
  }

  // 검색 연습
  @Get('search')
  async search(
    @Query('keyword') keyword: string,
    @Query('page') page = 1,
  ): Promise<any> {
    return await this.boardService.search(keyword, page);
  }
}
