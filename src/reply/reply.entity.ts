import { Comment } from 'src/comment/comment.entity';
import { User } from 'src/user/board.user-entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Reply extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Comment, (comment) => comment.reply)
  comments: Comment;

  @ManyToOne(() => User, (user) => user.reply)
  user: User;

  @Column({ type: 'uuid', nullable: true })
  @RelationId((reply: Reply) => reply.user)
  userId: string;
}
