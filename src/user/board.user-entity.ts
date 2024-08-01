import { Boards } from 'src/board/board.entity';
import { Comment } from 'src/comment/comment.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
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

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment;

  @OneToMany(() => Boards, (board) => board.user)
  board: Boards;

  @CreateDateColumn({ type: 'timestamptz' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleteAt?: Date;
}
