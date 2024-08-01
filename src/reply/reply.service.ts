import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplyRepository } from './reply.repository';
import { createReplyDto } from './dto/createReply.dto';
import { Reply } from './reply.entity';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(ReplyRepository)
    private replyRepository: ReplyRepository,
  ) {}

  async create(
    commentId: number,
    createReplyDto: createReplyDto,
  ): Promise<Reply> {
    try {
      return this.replyRepository.createR(commentId, createReplyDto);
    } catch (error) {
      console.error('답글 생성 중 오류 발생', error);
    }
  }

  async find(commentId: number): Promise<Reply[]> {
    try {
      const reply = this.replyRepository.find({
        where: { comments: { id: commentId } },
      });

      if (!reply) {
        throw new NotFoundException('답글을 찾을 수 없습니다.');
      }

      return reply;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('답글 조회 중 오류 발생', error);
    }
  }
}
