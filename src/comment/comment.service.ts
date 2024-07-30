import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from './comment.repository';
import { createCommentDto } from './dto/createCommentDto';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
  ) {}

  async createComment(
    boardId: number,
    createCommentDto: createCommentDto,
  ): Promise<Comment> {
    return this.commentRepository.createComment(boardId, createCommentDto);
  }

  async getComment(boardId: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { board: { id: boardId } } });
  }

  async createReply(
    commentId: number,
    createCommentDto: createCommentDto,
  ): Promise<Comment> {
    const alreadyReply = await this.commentRepository.findOne({
      where: { comments: { id: commentId } },
    });

    if (alreadyReply) {
      throw new Error('There is already a reply');
    }

    return this.commentRepository.createReply(commentId, createCommentDto);
  }

  async getReply(commentId: number): Promise<Comment> {
    return this.commentRepository.findOne({
      where: { comments: { id: commentId } },
    });
  }
}
