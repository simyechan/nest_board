import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReplyService } from './reply.service';
import { createReplyDto } from './dto/req/createReply.dto';
import { Reply } from './reply.entity';
import { findReplyDto } from './dto/res/findReply.dto';
import { updateReplyDto } from './dto/res/updateReply.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('reply')
export class ReplyController {
  constructor(private replyService: ReplyService) {}

  @Post(':commentId')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Param('commentId') commentId: number,
    @Req() req: Request,
    @Body() createReplyDto: createReplyDto,
  ): Promise<Reply> {
    return this.replyService.create(commentId, req, createReplyDto);
  }

  @Get(':commentId')
  async find(@Param('commentId') commentId): Promise<findReplyDto[]> {
    return this.replyService.find(commentId);
  }

  @Delete(':replyId')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('replyId') replyId, @Req() req: Request): Promise<void> {
    this.replyService.delete(replyId, req);
  }

  @Patch(':replyId')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('replyId') replyId,
    @Req() req: Request,
    @Body() updateReplyDto: updateReplyDto,
  ): Promise<void> {
    this.replyService.update(replyId, req, updateReplyDto);
  }
}
