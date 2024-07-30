import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Boards } from '../board/board.entity';
import { User } from 'src/user/board.user-entity';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Boards, (board) => board.comments)
  board: Boards;

  @ManyToOne(() => Comment, (comment) => comment.reply, { nullable: true })
  @JoinColumn()
  comments: Comment;

  @OneToOne(() => Comment, (comment) => comment.comments)
  reply: Comment;

  @ManyToOne(() => User, (user) => user.comment)
  user: User;
}
