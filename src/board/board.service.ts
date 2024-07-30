import { Injectable } from '@nestjs/common';
import { Boards } from './board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { createBoardDto } from './dto/createBoard.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}

  async getAllBoard(): Promise<Boards[]> {
    return this.boardRepository.find();
  }

  async createBoard(
    createBoardDto: createBoardDto,
    file: Express.Multer.File,
  ): Promise<Boards> {
    return this.boardRepository.createBoard(createBoardDto, file);
  }
}
