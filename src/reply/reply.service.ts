import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplyRepository } from './reply.repository';
import { createReplyDto } from './dto/req/createReply.dto';
import { Reply } from './reply.entity';
import { findReplyDto } from './dto/res/findReply.dto';
import { updateReplyDto } from './dto/res/updateReply.dto';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(ReplyRepository)
    private replyRepository: ReplyRepository,
  ) {}

  async create(
    commentId: number,
    userId: string,
    createReplyDto: createReplyDto,
  ): Promise<Reply> {
    try {
      return this.replyRepository.createR(commentId, userId, createReplyDto);
    } catch (error) {
      console.error('답글 생성 중 오류 발생', error);
    }
  }

  async find(commentId: number): Promise<findReplyDto[]> {
    try {
      const reply = this.replyRepository.find({
        where: { comments: { id: commentId } },
        relations: ['user'],
      });

      if (!reply) {
        throw new NotFoundException('답글을 찾을 수 없습니다.');
      }

      return (await reply).map((reply) => {
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

  async delete(replyId: number): Promise<void> {
    try {
      const result = await this.replyRepository.delete(replyId);

      if (result.affected === 0) {
        throw new NotFoundException('답글을 찾을 수 없습니다.');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('답글 삭제 중 오류 발생', error);
    }
  }

  async update(replyId: number, updateReplyDto: updateReplyDto): Promise<void> {
    try {
      const { content } = updateReplyDto;
      this.replyRepository.update({ id: replyId }, { content });
    } catch (error) {
      console.error('답글 업데이트 중 오류가 발생', error);
    }
  }
}
