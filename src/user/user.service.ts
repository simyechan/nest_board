import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './board.user-entity';
import { BoardRepository } from 'src/board/board.repository';
import { CommentRepository } from 'src/comment/comment.repository';
import { Request } from 'express';
import { mypageReqDto } from './dto/req/mypage.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
  ) {}

  async mypage(req: Request): Promise<mypageReqDto> {
    try {
      const user = req.user as User;
      const userId = user.id;

      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      const [boardCountResult, commentCountResult] = await Promise.all([
        this.boardRepository
          .createQueryBuilder('board')
          .where('board.userId = :userId', { userId })
          .getCount(),
        this.commentRepository
          .createQueryBuilder('comment')
          .where('comment.userId = :userId', { userId })
          .getCount(),
      ]);

      return {
        user,
        boardCount: boardCountResult,
        commentCount: commentCountResult,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('마이페이지를 불러오는 중 오류 발생', error);
    }
  }

  async users(): Promise<User[]> {
    try {
      const user = this.userRepository.find();
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log('사용자 조회 중 오류 발생', error);
    }
  }
}

// const result = await this.userRepository
//   .createQueryBuilder('user')
//   .leftJoinAndSelect('user.board', 'board')
//   .leftJoinAndSelect('user.comment', 'comment')
//   .where('user.id = :userId', { userId })
//   .select(['COUNT(board.id) AS B', 'COUNT(comment.id) AS C'])
//   .getRawOne(); //innerjoin, subquery

// const boardCount = parseInt(result.B, 10);
// const commentCount = parseInt(result.C, 10);

// return {
//   user,
//   boardCount,
//   commentCount,
// };

// subquery 사용
// const result = await this.userRepository
//   .createQueryBuilder('user')
//   .select([
//     'user.id',
//     '(SELECT COUNT(boards.id) FROM boards WHERE boards."userId" = user.id) AS boardCount',
//     '(SELECT COUNT(comment.id) FROM comment WHERE comment."userId" = user.id) AS commentCount',
//   ])
//   .where('user.id = :userId', { userId })
//   .getRawOne(); //innerjoin, subquery

// const boardCount = parseInt(result.boardCount, 10) || 0;
// const commentCount = parseInt(result.commentCount, 10) || 0;

// return {
//   user,
//   boardCount,
//   commentCount,
// };
