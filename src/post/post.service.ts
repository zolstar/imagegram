import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { getConnection } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from '../common/entities/post.entity';
import { IAuthContext } from '../common/interfaces/context.interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from '../common/entities/comment.entity';
import { ListPostDto } from './dto/list-post.dto';
import redisCache from '../common/vendor/redis';
import { base64Helper } from '../common/helpers/base64.helper';
import { ICursorPagination } from '../common/interfaces/index.interface';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async create(createPostDto: CreatePostDto, authContext: IAuthContext) {
    try {
      const newPost = Object.assign(new Post(), createPostDto);
      newPost.creator = authContext.account;
      return await getConnection().transaction(async (transactionManager) => {
        const post = await transactionManager.save(Post, newPost);
        return post;
      });
    } catch (e) {
      this.logger.log('[create] error ' + JSON.stringify(e));
      throw new InternalServerErrorException();
    }
  }

  async comment(createCommentDto: CreateCommentDto, authContext: IAuthContext) {
    try {
      const newComment = Object.assign(new Comment(), createCommentDto);
      newComment.creator = authContext.account;

      const comment = await getConnection().transaction(
        async (transactionManager) => {
          const comment = await transactionManager.save(Comment, newComment);
          await transactionManager.increment(
            Post,
            { id: createCommentDto.postId },
            'count',
            1,
          );
          return comment;
        },
      );
      await this.saveLast2Comments(createCommentDto.postId, comment.content);
      return comment;
    } catch (e) {
      this.logger.log('[create] error ' + JSON.stringify(e));
      throw new InternalServerErrorException();
    }
  }

  async list({ cursor }: ListPostDto) {
    try {
      const queryBuilder = await getConnection()
        .createQueryBuilder(Post, 'posts')
        .leftJoinAndSelect('posts.creator', 'creator')
        .orderBy('posts.count', 'DESC')
        .addOrderBy('posts.id', 'DESC')
        .limit(10);
      if (cursor) {
        const cursorStr = base64Helper.urlDecode(cursor);
        let cursorInfo: ICursorPagination;
        try {
          cursorInfo = JSON.parse(cursorStr);
        } catch (e) {
          throw new BadRequestException();
        }
        queryBuilder.where(
          'posts.count < :count OR (posts.count = :count AND posts.id < :lastId)',
          cursorInfo,
        );
      }
      const posts = await queryBuilder.getMany();
      const postsWithCommentsPromise = posts.map(
        async ({ id, caption, image, count, createdAt, creator }) => {
          const comments = await redisCache.lrange(id, 0, 1);
          return {
            id,
            caption,
            image,
            count,
            createdAt,
            creator,
            comments: comments.reverse(),
            cursor: base64Helper.urlEncode(
              JSON.stringify({ lastId: id, count }),
            ),
          };
        },
      );
      const postsWithComments = await Promise.all(postsWithCommentsPromise);
      return postsWithComments;
    } catch (e) {
      this.logger.log('[create] error ' + JSON.stringify(e));
      throw new InternalServerErrorException();
    }
  }

  async saveLast2Comments(postId: string, content: string) {
    const l = await redisCache.lpush(postId, content);
    if (l > 2) {
      await redisCache.ltrim(postId, 0, 1);
    }
  }
}
