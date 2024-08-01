import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { User } from 'src/user/board.user-entity';

@Entity()
export class Boards extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  contents: string;

  @Column({ type: 'bytea', nullable: true })
  image: Buffer;

  @OneToMany(() => Comment, (comment) => comment.board, { cascade: true })
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.board)
  @JoinColumn({ name: 'userId' })
  user: User;
}
