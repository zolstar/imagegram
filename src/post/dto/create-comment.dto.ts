import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MaxLength(50)
  content: string;

  @IsInt()
  @IsOptional()
  postId?: string;
}
