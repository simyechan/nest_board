import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from './comment.repository';
import { createCommentDto } from './dto/req/createComment.dto';
import { Comment } from './comment.entity';
import { findCommentDto } from './dto/res/findComment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
  ) {}

  async create(
    boardId: number,
    userId: string,
    createCommentDto: createCommentDto,
  ): Promise<Comment> {
    try {
      return this.commentRepository.createC(boardId, userId, createCommentDto);
    } catch (error) {
      console.error('댓글 생성 중 오류 발생', error);
    }
  }

  async find(boardId: number): Promise<findCommentDto[]> {
    try {
      const comment = this.commentRepository.find({
        where: { board: { id: boardId } },
        relations: ['user'],
      });

      if (!comment) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      return (await comment).map((comment) => {
        if (!comment.user) {
          throw new NotFoundException('댓글 작성자 정보가 누락되었습니다.');
        }
        return {
          id: comment.id,
          content: comment.content,
          name: comment.user.name,
        };
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('댓글 조회 중 오류 발생', error);
    }
  }
}
