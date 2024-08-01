import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { createCommentDto } from './dto/req/createComment.dto';
import { Boards } from 'src/board/board.entity';
import { User } from 'src/user/board.user-entity';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(
    private dataSource: DataSource,
    // @InjectRepository(Boards) private repository,
  ) {
    super(Comment, dataSource.createEntityManager());
  }

  async createC(
    boardId: number,
    userId: string,
    createCommentDto: createCommentDto,
  ): Promise<Comment> {
    const { content } = createCommentDto;

    try {
      const board = await this.dataSource.getRepository(Boards).findOne({
        where: { id: boardId },
      });

      if (!board) {
        throw new NotFoundException('게시물을 찾을 수 없습니다.');
      }

      const user = await this.dataSource.getRepository(User).findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      const comment = this.create({
        content,
        board,
        user,
      });

      await this.save(comment);

      return comment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '댓글 생성 중 오류가 발생했습니다.',
      );
    }
  }
}
