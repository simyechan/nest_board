import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Boards } from './board.entity';
import { createBoardDto } from './dto/createBoard.dto';

@Injectable()
export class BoardRepository extends Repository<Boards> {
  constructor(private dataSource: DataSource) {
    super(Boards, dataSource.createEntityManager());
  }

  async createBoard(
    createBoardDto: createBoardDto,
    file: Express.Multer.File,
  ): Promise<Boards> {
    const { title, contents } = createBoardDto;

    if (file) {
      console.log('파일이 제공되었습니다:', file.originalname);
      console.log('파일 버퍼 길이:', file.buffer.length);
    } else {
      console.log('파일이 제공되지 않았습니다.');
    }

    const imageBuffer = file ? file.buffer : null;

    const board = this.create({
      title,
      contents,
      image: imageBuffer,
    });

    await this.save(board);

    return board;
  }
}
