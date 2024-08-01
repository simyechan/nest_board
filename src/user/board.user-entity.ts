import { Boards } from 'src/board/board.entity';
import { Comment } from 'src/comment/comment.entity';
import { Reply } from 'src/reply/reply.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comment: Comment;

  @OneToMany(() => Boards, (board) => board.user, { cascade: true })
  board: Boards;

  @OneToMany(() => Reply, (reply) => reply.user, { cascade: true })
  reply: Reply;

  @CreateDateColumn({ type: 'timestamptz' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleteAt?: Date;
}
