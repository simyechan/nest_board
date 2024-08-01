import { Comment } from 'src/comment/comment.entity';
import { User } from 'src/user/board.user-entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Reply extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Comment, (comment) => comment.reply, { nullable: true })
  comments: Comment;

  @ManyToOne(() => User, (user) => user.reply)
  user: User;
}
