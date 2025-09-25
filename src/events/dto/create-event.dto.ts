/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { EventType } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsString,
  IsObject,
} from 'class-validator';

export class CreateEventDto {
  @IsEnum(EventType)
  @IsNotEmpty()
  type: EventType;

  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  organizerId: string;
}
