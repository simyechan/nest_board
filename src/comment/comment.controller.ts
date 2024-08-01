import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { createCommentDto } from './dto/req/createComment.dto';
import { Comment } from './comment.entity';
import { findCommentDto } from './dto/res/findComment.dto';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post(':boardId/:userId')
  async create(
    @Param('boardId') boardId: number,
    @Param('userId') userId: string,
    @Body() createCommentDto: createCommentDto,
  ): Promise<Comment> {
    return this.commentService.create(boardId, userId, createCommentDto);
  }

  @Get(':boardId')
  async find(@Param('boardId') boardId: number): Promise<findCommentDto[]> {
    return this.commentService.find(boardId);
  }

  @Delete(':commentId')
  async delete(@Param('commentId') commentId: number): Promise<void> {
    this.commentService.delete(commentId);
  }
}
