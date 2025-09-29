import { EventType } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsObject,
  IsUUID,
} from 'class-validator';

export class CreateEventDto {
  @IsEnum(EventType)
  @IsNotEmpty()
  type: EventType;

  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  @IsUUID()
  userId: string;
}
