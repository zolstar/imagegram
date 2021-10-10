import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { mockProviders } from '../../test';

describe('PostController', () => {
  let controller: PostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: mockProviders,
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
