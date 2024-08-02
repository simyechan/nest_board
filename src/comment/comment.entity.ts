import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
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

  @Column({ type: 'uuid', nullable: true })
  @RelationId((comment: Comment) => comment.user)
  userId: string;

  @ManyToOne(() => Boards, (board) => board.comments)
  board: Boards;

  @Column({type: 'int', nullable: true})
  @RelationId((comment: Comment) => comment.board)
  boardId: number

  @OneToMany(() => Reply, (reply) => reply.comments, { cascade: true })
  reply: Reply[];
}
