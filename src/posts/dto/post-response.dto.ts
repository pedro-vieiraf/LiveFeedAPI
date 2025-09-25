import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class PostResponseDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  imageUrl?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => UserResponseDto)
  author: UserResponseDto;
}
