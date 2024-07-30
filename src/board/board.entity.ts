import {
  BaseEntity,
  Column,
  Entity,
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

  @OneToMany(() => Comment, (comment) => comment.board)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.board)
  user: User;
}
