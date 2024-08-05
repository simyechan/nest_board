import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from './comment.repository';
import { createCommentDto } from './dto/req/createComment.dto';
import { Comment } from './comment.entity';
import { findCommentDto } from './dto/res/findComment.dto';
import { updateCommentDto } from './dto/req/updateComment.dto';
import { Request } from 'express';
import { User } from 'src/user/board.user-entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
  ) {}

  async create(
    boardId: number,
    req: Request,
    createCommentDto: createCommentDto,
  ): Promise<Comment> {
    try {
      return this.commentRepository.createC(boardId, req, createCommentDto);
    } catch (error) {
      console.error('댓글 생성 중 오류 발생', error);
    }
  }

  async find(boardId: number): Promise<findCommentDto[]> {
    try {
      const comment = await this.commentRepository.find({
        where: { board: { id: boardId } },
        relations: ['user'],
      });

      if (!comment) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      return comment.map((comment) => {
        if (!comment.user) {
          throw new NotFoundException('작성자 정보가 누락되었습니다.');
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

  async delete(commentId: number, req: Request): Promise<void> {
    try {
      const user = req.user as User;

      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        relations: ['user'],
      });

      if (!comment) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      if (comment.user.id !== user.id) {
        throw new UnauthorizedException('댓글을 삭제할 수 없습니다.');
      }

      const result = await this.commentRepository.delete(commentId);

      if (result.affected === 0) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      console.error('댓글 삭제 중 오류 발생', error);
    }
  }

  async update(
    commentId: number,
    updateCommentDto: updateCommentDto,
    req: Request,
  ): Promise<void> {
    try {
      const user = req.user as User;

      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        relations: ['user'],
      });

      if (!comment) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      if (comment.user.id !== user.id) {
        throw new UnauthorizedException('댓글을 수정할 수 없습니다.');
      }

      const { content } = updateCommentDto;
      await this.commentRepository.update({ id: commentId }, { content });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      console.error('댓글 업데이트 중 오류 발생', error);
    }
  }
}
