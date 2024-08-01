import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Boards } from '../board/board.entity';
import { User } from 'src/user/board.user-entity';
import { Reply } from 'src/reply/reply.entity';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.comment)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Boards, (board) => board.comments)
  board: Boards;

  @OneToMany(() => Reply, (reply) => reply.comments, { cascade: true })
  reply: Reply[];
}
