import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Boards } from './board.entity';
import { createBoardDto } from './dto/req/createBoard.dto';
import { User } from 'src/user/board.user-entity';
import { updateBoardDto } from './dto/req/updateBoard.dto';

@Injectable()
export class BoardRepository extends Repository<Boards> {
  constructor(private dataSource: DataSource) {
    super(Boards, dataSource.createEntityManager());
  }

  async createB(
    createBoardDto: createBoardDto,
    file: Express.Multer.File,
  ): Promise<Boards> {
    const { name, ...other } = createBoardDto;

    if (!file) {
      if (file.buffer) {
        console.log('파일 버퍼 길이:', file.buffer.length);
      } else {
        console.error('파일 버퍼가 존재하지 않습니다.');
        throw new Error('파일 버퍼가 존재하지 않습니다.');
      }
    } else {
      console.log('파일이 제공되지 않았습니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let user = await queryRunner.manager.findOne(User, { where: { name } });
      if (!user) {
        user = queryRunner.manager.create(User, { name });
        await queryRunner.manager.save(User, user);
      }

      const board = queryRunner.manager.create(Boards, {
        ...other,
        image: file.path,
        user,
      });

      await queryRunner.manager.save(Boards, board);

      await queryRunner.commitTransaction();

      return board;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateB(
    boardId: number,
    updateBoardDto: updateBoardDto,
    file: Express.Multer.File | undefined,
  ): Promise<Boards> {
    try {
      const board = await this.findOne({ where: { id: boardId } });

      if (!board) {
        throw new NotFoundException('게시물을 찾을 수 없습니다.');
      }

      if (updateBoardDto.title !== undefined) {
        board.title = updateBoardDto.title;
      }
      if (updateBoardDto.contents !== undefined) {
        board.contents = updateBoardDto.contents;
      }
      if (file) {
        board.image = file.path;
      }

      const result = await this.save(board);

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '게시물 업데이트 중 오류가 발생했습니다.',
        error,
      );
    }
  }
}
