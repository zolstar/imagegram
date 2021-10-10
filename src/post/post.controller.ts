import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SuccessResponse } from '../common/helpers/response';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ImageProcessor } from '../common/vendor/image-processor';
import { ListPostDto } from './dto/list-post.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @Req() req,
  ) {
    if (
      !file ||
      !['image/jpeg', 'image/png', 'image/bmp'].includes(file.mimetype)
    ) {
      throw new BadRequestException();
    }
    const fileName = await ImageProcessor.bufferToJpg(file.buffer);
    const data = await this.postService.create(
      { ...createPostDto, image: fileName },
      req.authContext,
    );
    return new SuccessResponse(data);
  }

  @UseGuards(AuthGuard)
  @Post(':id/comments')
  @HttpCode(HttpStatus.OK)
  async comment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ) {
    const data = await this.postService.comment(
      { ...createCommentDto, postId: id },
      req.authContext,
    );
    return new SuccessResponse(data);
  }

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@Query() listPostDto: ListPostDto) {
    const data = await this.postService.list(listPostDto);
    return new SuccessResponse(data);
  }
}
