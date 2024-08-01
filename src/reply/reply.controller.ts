import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { createReplyDto } from './dto/createReply.dto';
import { Reply } from './reply.entity';

@Controller('reply')
export class ReplyController {
  constructor(private replyService: ReplyService) {}

  @Post(':commentId')
  async create(
    @Param('commentId') commentId: number,
    @Body() createReplyDto: createReplyDto,
  ): Promise<Reply> {
    return this.replyService.create(commentId, createReplyDto);
  }

  @Get(':commentId')
  async find(@Param('commentId') commentId): Promise<Reply[]> {
    return this.replyService.find(commentId);
  }
}
