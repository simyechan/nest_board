import {
  Injectable,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(
    private dataSource: DataSource,
    // @InjectRepository(Boards) private repository,
  ) {
    super(Comment, dataSource.createEntityManager());
  }
}
