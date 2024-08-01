import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { BoardRepository } from "src/board/board.repository";
import { CommentRepository } from "src/comment/comment.repository";
import { User } from "./board.user-entity";

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

  async mypage(
    userId: string,
  ): Promise<{ user: User; boardCount: number; commentCount: number }> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      const boardResult = await this.boardRepository
        .createQueryBuilder('board')
        .select('COUNT(board.id)', 'count')
        .where('board.userId = :userId', { userId })
        .getRawOne();

      const commentResult = await this.commentRepository
        .createQueryBuilder('comment')
        .select('COUNT(comment.id)', 'count')
        .where('comment.userId = :userId', { userId })
        .getRawOne();

      // const result = await this.userRepository
      // .createQueryBuilder('user')

      const boardCount = parseInt(boardResult.count, 10);
      const commentCount = parseInt(commentResult.count, 10);

      return { user, boardCount, commentCount };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('마이페이지를 불러오는 중 오류 발생', error);
    }
  }
}
