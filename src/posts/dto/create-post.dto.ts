import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsUUID()
  authorId: string;
}
