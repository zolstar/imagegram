import { IsString, MaxLength } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @MaxLength(50)
  name: string;
}
