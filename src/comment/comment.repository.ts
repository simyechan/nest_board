import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { createCommentDto } from './dto/createCommentDto';
import { Boards } from 'src/board/board.entity';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(private dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  async createComment(
    boardId: number,
    createCommentDto: createCommentDto,
  ): Promise<Comment> {
    const { content } = createCommentDto;

    const board = await this.dataSource.getRepository(Boards).findOne({
      where: { id: boardId },
    });

    const comment = this.create({
      content,
      board,
    });

    await this.save(comment);

    return comment;
  }

  async createReply(
    commentId: number,
    createCommentDto: createCommentDto,
  ): Promise<Comment> {
    const { content } = createCommentDto;

    const comment = await this.dataSource.getRepository(Comment).findOne({
      where: { id: commentId },
    });

    const reply = this.create({
      content,
      comments: comment,
    });

    await this.save(reply);

    return comment;
  }
}
