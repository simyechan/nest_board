import { Boards } from 'src/board/board.entity';
import { Comment } from 'src/comment/comment.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment;

  @OneToMany(() => Boards, (board) => board.user)
  board: Boards;
}
