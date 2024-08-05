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
import { findBoardDto } from './dto/res/findAllBoard.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
    @InjectRepository(ReplyRepository)
    private replyRepository: ReplyRepository,
  ) {}

  async findAll(): Promise<findBoardDto[]> {
    try {
      const boards = await this.boardRepository.find({
        relations: ['user', 'comments'],
      });

      if (!boards) {
        throw new NotFoundException('게시물을 찾을 수 없습니다');
      }

      const boardIds = boards.map((board) => board.id);

      const commentCounts = await this.commentRepository
        .createQueryBuilder('comment')
        .select('comment.boardId', 'boardId')
        .addSelect('COUNT(comment.id)', 'count')
        .where('comment.boardId IN (:...boardIds)', { boardIds })
        .groupBy('comment.boardId')
        .getRawMany();

      const commentCountMap = new Map(
        commentCounts.map((item) => [item.boardId, parseInt(item.count, 10)]),
      );

      const repliesCounts = await Promise.all(
        (await boards).map(async (board) => {
          let repliesResult = await this.replyRepository
            .createQueryBuilder('reply')
            .select('COUNT(reply.id)', 'count')
            .innerJoin('reply.comments', 'comment')
            .where('comment.boardId = :boardId', { boardId: board.id })
            .getRawOne();
          return {
            boardId: board.id,
            count: (repliesResult = parseInt(repliesResult.count, 10) || 0),
          };
        }),
      );

      const repliesCountMap = new Map(
        repliesCounts.map((item) => [item.boardId, item.count]),
      );

      const results = boards.map((board) => {
        const commentCount = commentCountMap.get(board.id) || 0;
        const repliesCount = repliesCountMap.get(board.id) || 0;
        return { commentCount, repliesCount, board };
      });

      return results;
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
    try {
      return this.boardRepository.createB(createReqBoardDto, req, file);
    } catch (error) {
      console.error('게시물 생성 중 오류 발생', error);
    }
  }

  async find(boardId: number): Promise<findBoardDto> {
  // replies: Reply[];
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

      // const replyResult = await this.commentRepository.find({
      //   where: { board: { id: boardId } },
      //   relations: ['reply'],
      // });

      // const replies = replyResult.flatMap((comment) => comment.reply);

      return { commentCount, repliesCount, board };
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
    updateBoardDto: updateReqBoardDto,
    req: Request,
    file: Express.Multer.File | undefined,
  ): Promise<updateResBoardDto> {
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
        throw new UnauthorizedException('게시물을 수정할 수 없습니다.');
      }

      return this.boardRepository.updateB(boardId, updateBoardDto, file);
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
}
