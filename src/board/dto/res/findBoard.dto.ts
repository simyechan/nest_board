import { Comment } from 'src/comment/comment.entity';
import { Reply } from 'src/reply/reply.entity';

export class findBoardDto {
  commentCount: number;

  repliesCount: number;

  id: number;

  title: string;

  contents: string;

  image: string;

  name: string;

  comment: Comment[];

  reply: Reply[];
}
