import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { mockProviders } from '../../test';

describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...mockProviders, PostService],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
