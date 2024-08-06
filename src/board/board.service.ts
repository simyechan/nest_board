import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Boards } from './board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { CommentRepository } from 'src/comment/comment.repository';
import { ReplyRepository } from 'src/reply/reply.repository';
import { Request } from 'express';
import { User } from 'src/user/board.user-entity';
import { updateResBoardDto } from './dto/res/updateBoard.dto';
import { createReqBoardDto } from './dto/req/createBoard.dto';
import { updateReqBoardDto } from './dto/req/updateBoard.dto';
import { findBoardDto } from './dto/res/findBoard.dto';
import { DataSource } from 'typeorm';
import { findAllBoardDto } from './dto/res/findAllBoard.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
    @InjectRepository(ReplyRepository)
    private replyRepository: ReplyRepository,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<findAllBoardDto[]> {
    try {
      const boards = await this.boardRepository.find({
        relations: ['user', 'comments'],
      });

      if (!boards) {
        throw new NotFoundException('게시물을 찾을 수 없습니다');
      }

      const counts = await this.commentRepository
        .createQueryBuilder('comment')
        .select('comment.boardId', 'boardId')
        .addSelect('COUNT(comment.id)', 'commentCount')
        .innerJoin('comment.reply', 'reply')
        .addSelect('COUNT(reply.id)', 'repliesCount')
        .where('comment.boardId IN (:...boardIds)', {
          boardIds: boards.map((board) => board.id),
        })
        .groupBy('comment.boardId')
        .getRawMany();

      const countMap = new Map(
        counts.map((item) => [
          item.boardId,
          {
            commentCount: parseInt(item.commentCount, 10) || 0,
            repliesCount: parseInt(item.repliesCount, 10) || 0,
          },
        ]),
      );

      return boards.map((board) => {
        const { commentCount, repliesCount } = countMap.get(board.id) || {
          commentCount: 0,
          repliesCount: 0,
        };
        return { commentCount, repliesCount, board };
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('게시물 조회 중 오류 발생', error);
    }
  }

  async create(
    createReqBoardDto: createReqBoardDto,
    req: Request,
    file?: Express.Multer.File,
  ): Promise<Boards> {
    const user = req.user;
    const { ...other } = createReqBoardDto;

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

  async find(boardId: number): Promise<findBoardDto> {
    try {
      const board = await this.boardRepository.findOne({
        where: { id: boardId },
        relations: ['user', 'comments'],
      });

      if (!board) {
        throw new NotFoundException('게시물을 찾을 수 없습니다.');
      }

      const commentResult = await this.commentRepository
        .createQueryBuilder('comment')
        .select('COUNT(comment.id)', 'count')
        .where('comment.boardId = :boardId', { boardId })
        .getRawOne();

      const commentCount = parseInt(commentResult.count, 10);

      const repliesResult = await this.replyRepository
        .createQueryBuilder('reply')
        .select('COUNT(reply.id)', 'count')
        .innerJoin('reply.comments', 'comment')
        .where('comment.boardId = :boardId', { boardId })
        .getRawOne();

      const repliesCount = parseInt(repliesResult.count, 10);

      const comments = await this.commentRepository.find({
        where: { board: { id: boardId } },
        relations: ['reply'],
      });

      return {
        commentCount,
        repliesCount,
        id: board.id,
        title: board.title,
        contents: board.contents,
        image: board.image,
        name: board.user.name,
        comment: comments,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('게시물 조회 중 오류 발생', error);
    }
  }

  async delete(boardId: number, req: Request): Promise<void> {
    try {
      const user = req.user as User;

      const board = await this.boardRepository.findOne({
        where: { id: boardId },
        relations: ['user'],
      });

      if (!board) {
        throw new NotFoundException('게시물을 찾을 수 없습니다.');
      }

      if (board.user.id !== user.id) {
        throw new UnauthorizedException('게시물을 삭제할 수 없습니다.');
      }

      const result = await this.boardRepository.delete(boardId);

      if (result.affected === 0) {
        throw new NotFoundException('게시물을 찾을 수 없습니다.');
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      console.error('게시물 삭제 중 오류 발생', error);
    }
  }

  async update(
    boardId: number,
    updateReqBoardDto: updateReqBoardDto,
    req: Request,
    file: Express.Multer.File | undefined,
  ): Promise<updateResBoardDto> {
    try {
      const user = req.user as User;
      const { title, contents } = updateReqBoardDto;

      const board = await this.boardRepository.findOne({
        where: { id: boardId },
        relations: ['user'],
      });

      if (!board) {
        throw new NotFoundException('게시물을 찾을 수 없습니다.');
      }

      if (board.user.id !== user.id) {
        throw new UnauthorizedException('게시물을 수정할 수 없습니다.');
      }

      if (title !== undefined) {
        board.title = title;
      }
      if (contents !== undefined) {
        board.contents = contents;
      }
      if (file) {
        board.image = file.path;
      }

      const result = await this.boardRepository.save(board);

      return result;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      console.error('게시물 업데이트 중 오류 발생', error);
    }
  }

  async search(keyword: string, page: number): Promise<any> {
    const skip = (page - 1) * 5;

    const [result, total] = await this.boardRepository
      .createQueryBuilder('boards')
      .leftJoinAndSelect('boards.user', 'user')
      .where('boards.title LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('boards.contents LIKE :keyword', { keyword: `%${keyword}%` })
      .skip(skip)
      .take(5)
      .getManyAndCount();

    const finalResult = result.map((board) => ({
      ...board,
      name: board.user.name,
    }));

    return {
      result: finalResult,
      total,
      page,
      lastPage: Math.ceil(total / 5),
    };
  }
}
