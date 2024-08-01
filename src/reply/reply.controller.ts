import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { createReplyDto } from './dto/req/createReply.dto';
import { Reply } from './reply.entity';
import { findReplyDto } from './dto/res/findReply.dto';

@Controller('reply')
export class ReplyController {
  constructor(private replyService: ReplyService) {}

  @Post(':commentId/:userId')
  async create(
    @Param('commentId') commentId: number,
    @Param('userId') userId: string,
    @Body() createReplyDto: createReplyDto,
  ): Promise<Reply> {
    return this.replyService.create(commentId, userId, createReplyDto);
  }

  @Get(':commentId')
  async find(@Param('commentId') commentId): Promise<findReplyDto[]> {
    return this.replyService.find(commentId);
  }

  @Delete(':replyId')
  async delete(@Param('replyId') replyId): Promise<void> {
    this.replyService.delete(replyId);
  }
}
