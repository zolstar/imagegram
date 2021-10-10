import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

jest.setTimeout(100000);

describe('App (e2e)', () => {
  let app, accountId;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('GET / should return status code 404', () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });

  it('POST /api/accounts - create account should return status code 200', async () => {
    const createAccountResponse = await request(app.getHttpServer())
      .post('/api/accounts')
      .send({
        name: `account ${new Date().getTime()}`,
      });

    expect(createAccountResponse.statusCode).toBe(200);

    accountId = createAccountResponse?.body?.data?.id || null;

    expect(typeof accountId).toBe('string');
  });

  it('POST /api/posts - create account post return status code 200', async () => {
    const createPostResponse = await request(app.getHttpServer())
      .post('/api/posts')
      .set('X-Account-Id', accountId)
      .attach('image', join(__dirname, 'star.png'))
      .field('caption', `caption ${new Date().getTime()}`);

    expect(createPostResponse.statusCode).toBe(200);

    const postId = createPostResponse?.body?.data?.id || null;

    expect(typeof postId).toBe('string');
  });

  it('create 20 posts, each post has 1 to 5 comments', async () => {
    for (let i = 1; i <= 20; i++) {
      const createPostResponse = await request(app.getHttpServer())
        .post('/api/posts')
        .set('X-Account-Id', accountId)
        .attach('image', join(__dirname, 'star.png'))
        .field('caption', `caption ${new Date().getTime()}`);

      expect(createPostResponse.statusCode).toBe(200);

      const postId = createPostResponse?.body?.data?.id || null;

      expect(typeof postId).toBe('string');

      const randomNumber = Math.floor(Math.random() * 5) + 1;

      for (let j = 1; j < randomNumber; j++) {
        const createCommentResponse = await request(app.getHttpServer())
          .post(`/api/posts/${postId}/comments`)
          .set('X-Account-Id', accountId)
          .send({
            content: `comment ${new Date().getTime()}`,
          });

        expect(createCommentResponse.statusCode).toBe(200);
      }
    }
  });

  it('GET /api/posts - list post should return status code 200', async () => {
    const getPostResponse = await request(app.getHttpServer())
      .get(`/api/posts`)
      .set('X-Account-Id', accountId);

    expect(getPostResponse.statusCode).toBe(200);
  });

  // it('GET /api/posts - list post - get next page should return status code 200', async () => {
  //   const getPostResponse = await request(app.getHttpServer())
  //     .get(`/api/posts`)
  //     .set('X-Account-Id', accountId);
  //
  //   expect(getPostResponse.statusCode).toBe(200);
  // });
});
