import { IsOptional, IsString } from 'class-validator';

export class ListPostDto {
  @IsString()
  @IsOptional()
  cursor?: string;
}
