import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from '@prisma/client';
import { EventTypeEnum } from 'src/common/enums/event-type.enum';
import { plainToInstance } from 'class-transformer';
import { EventResponseDto } from './dto/event-response.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto): Promise<EventResponseDto> {
    const type = createEventDto.type as EventTypeEnum;
    const payload = createEventDto.payload;
    const userId = createEventDto.userId;

    const newEvent = await this.prisma.event.create({
      data: {
        type,
        payload,
        user: {
          connect: { id: userId },
        },
      },
      select: {
        id: true,
        type: true,
        payload: true,
        user: true,
      },
    });

    return plainToInstance(EventResponseDto, newEvent);
  }

  async findAll(): Promise<Event[]> {
    return await this.prisma.event.findMany();
  }

  async findOne(id: string): Promise<Event | null> {
    return await this.prisma.event.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    return await this.prisma.event.update({
      where: { id },
      data: updateEventDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.event.delete({
      where: { id },
    });

    return;
  }
}
