import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class EventResponseDto {
  @Expose()
  id: string;

  @Expose()
  type: string;

  @Expose()
  payload?: Record<string, any>;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  createdAt: Date;
}
