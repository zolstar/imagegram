import { IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(50)
  caption: string;

  image: string;
}
