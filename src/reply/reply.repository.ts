import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Reply } from './reply.entity';
import { createReplyDto } from './dto/req/createReply.dto';
import { Comment } from 'src/comment/comment.entity';
import { User } from 'src/user/board.user-entity';

@Injectable()
export class ReplyRepository extends Repository<Reply> {
  constructor(private dataSource: DataSource) {
    super(Reply, dataSource.createEntityManager());
  }

  async createR(
    commentId: number,
    userId: string,
    createReplyDto: createReplyDto,
  ): Promise<Reply> {
    const { content } = createReplyDto;

    try {
      const comment = await this.dataSource.getRepository(Comment).findOne({
        where: { id: commentId },
      });

      if (!comment) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      const user = await this.dataSource.getRepository(User).findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      const reply = this.create({
        content,
        comments: comment,
        user,
      });

      await this.save(reply);

      return reply;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '답글 생성 중 오류가 발생했습니다.',
      );
    }
  }
}
