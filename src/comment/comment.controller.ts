import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { createCommentDto } from './dto/createCommentDto';
import { Comment } from './comment.entity';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post(':boardId')
  async createComment(
    @Param('boardId') boardId: number,
    @Body() createCommentDto: createCommentDto,
  ): Promise<Comment> {
    return this.commentService.createComment(boardId, createCommentDto);
  }

  @Get(':boardId')
  async getComment(@Param('boardId') boardId: number): Promise<Comment[]> {
    return this.commentService.getComment(boardId);
  }

  @Post('reply/:commentId')
  async createReply(
    @Param('commentId') commentId: number,
    @Body() createCommentDto: createCommentDto,
  ): Promise<Comment> {
    return this.commentService.createReply(commentId, createCommentDto);
  }

  @Get('reply/:commentId')
  async getReply(@Param('commentId') commentId: number): Promise<Comment> {
    return this.commentService.getReply(commentId);
  }
}
