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
import { CommentService } from './comment.service';
import { createCommentDto } from './dto/req/createComment.dto';
import { Comment } from './comment.entity';
import { findCommentDto } from './dto/res/findComment.dto';
import { updateCommentDto } from './dto/req/updateComment.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post(':boardId')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Param('boardId') boardId: number,
    @Req() req: Request,
    @Body() createCommentDto: createCommentDto,
  ): Promise<Comment> {
    return this.commentService.create(boardId, req, createCommentDto);
  }

  @Get(':boardId')
  async find(@Param('boardId') boardId: number): Promise<findCommentDto[]> {
    return this.commentService.find(boardId);
  }

  @Delete(':commentId')
  @UseGuards(AuthGuard('jwt'))
  async delete(
    @Param('commentId') commentId: number,
    @Req() req: Request,
  ): Promise<void> {
    this.commentService.delete(commentId, req);
  }

  @Patch(':commentId')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: updateCommentDto,
    @Req() req: Request,
  ): Promise<void> {
    this.commentService.update(commentId, updateCommentDto, req);
  }
}
