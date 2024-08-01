import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from './comment.repository';
import { createCommentDto } from './dto/createComment.dto';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
  ) {}

  async create(
    boardId: number,
    createCommentDto: createCommentDto,
  ): Promise<Comment> {
    try {
      return this.commentRepository.createC(boardId, createCommentDto);
    } catch (error) {
      console.error('댓글 생성 중 오류 발생', error);
    }
  }

  async find(boardId: number): Promise<Comment[]> {
    try {
      const comment = this.commentRepository.find({
        where: { board: { id: boardId } },
      });

      if (!comment) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      return comment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('댓글 조회 중 오류 발생', error);
    }
  }
}
