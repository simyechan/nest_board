import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplyRepository } from './reply.repository';
import { createReplyDto } from './dto/req/createReply.dto';
import { Reply } from './reply.entity';
import { findReplyDto } from './dto/res/findReply.dto';
import { updateReplyDto } from './dto/res/updateReply.dto';
import { Request } from 'express';
import { User } from 'src/user/board.user-entity';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(ReplyRepository)
    private replyRepository: ReplyRepository,
  ) {}

  async create(
    commentId: number,
    req: Request,
    createReplyDto: createReplyDto,
  ): Promise<Reply> {
    try {
      return this.replyRepository.createR(commentId, req, createReplyDto);
    } catch (error) {
      console.error('답글 생성 중 오류 발생', error);
    }
  }

  async find(commentId: number): Promise<findReplyDto[]> {
    try {
      const reply = await this.replyRepository.find({
        where: { comments: { id: commentId } },
        relations: ['user'],
      });

      if (!reply) {
        throw new NotFoundException('답글을 찾을 수 없습니다.');
      }

      return reply.map((reply) => {
        if (!reply.user) {
          throw new NotFoundException('작성자 정보가 누락되었습니다.');
        }
        return {
          id: reply.id,
          content: reply.content,
          name: reply.user.name,
        };
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('답글 조회 중 오류 발생', error);
    }
  }

  async delete(replyId: number, req: Request): Promise<void> {
    try {
      const user = req.user as User;

      const reply = await this.replyRepository.findOne({
        where: { id: replyId },
        relations: ['user'],
      });

      if (!reply) {
        throw new NotFoundException('답글을 찾을 수 없습니다.');
      }

      if (reply.user.id !== user.id) {
        throw new UnauthorizedException('답글을 삭제할 수 없습니다.');
      }

      const result = await this.replyRepository.delete(replyId);

      if (result.affected === 0) {
        throw new NotFoundException('답글을 찾을 수 없습니다.');
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      console.error('답글 삭제 중 오류 발생', error);
    }
  }

  async update(
    replyId: number,
    req: Request,
    updateReplyDto: updateReplyDto,
  ): Promise<void> {
    try {
      const user = req.user as User;

      const reply = await this.replyRepository.findOne({
        where: { id: replyId },
        relations: ['user'],
      });

      if (!reply) {
        throw new NotFoundException('답글을 찾을 수 없습니다.');
      }

      if (reply.user.id !== user.id) {
        throw new UnauthorizedException('답글을 수정할 수 없습니다.');
      }
      const { content } = updateReplyDto;
      await this.replyRepository.update({ id: replyId }, { content });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      console.error('답글 업데이트 중 오류가 발생', error);
    }
  }
}
