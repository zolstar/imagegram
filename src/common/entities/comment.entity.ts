import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Post } from './post.entity';

@Entity({
  name: 'comments',
})
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  creatorId: string;

  @Column()
  postId: string;

  @ManyToOne(() => Account)
  @JoinColumn()
  creator: Account;

  @ManyToOne(() => Post)
  @JoinColumn()
  post: Post;

  @CreateDateColumn()
  createdAt: Date;
}
