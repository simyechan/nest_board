import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { createCommentDto } from './dto/createComment.dto';
import { Comment } from './comment.entity';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post(':boardId')
  async create(
    @Param('boardId') boardId: number,
    @Body() createCommentDto: createCommentDto,
  ): Promise<Comment> {
    return this.commentService.create(boardId, createCommentDto);
  }

  @Get(':boardId')
  async find(@Param('boardId') boardId: number): Promise<Comment[]> {
    return this.commentService.find(boardId);
  }
}
