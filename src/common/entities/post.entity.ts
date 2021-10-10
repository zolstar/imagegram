import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Comment } from './comment.entity';

@Entity({
  name: 'posts',
})
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  caption: string;

  @Column()
  image: string;

  @Column()
  count: number;

  @OneToOne(() => Account)
  @JoinColumn()
  creator: Account;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Comment, (comment) => comment.post)
  @JoinColumn()
  comments: Comment[];
}
