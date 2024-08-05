import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { createCommentDto } from './dto/req/createComment.dto';
import { Boards } from 'src/board/board.entity';
import { User } from 'src/user/board.user-entity';
import { Request } from 'express';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(
    private dataSource: DataSource,
    // @InjectRepository(Boards) private repository,
  ) {
    super(Comment, dataSource.createEntityManager());
  }
}
