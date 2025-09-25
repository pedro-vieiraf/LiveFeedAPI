import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from '@prisma/client';
import { EventTypeEnum } from 'src/common/enums/event-type.enum';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const type = createEventDto.type as EventTypeEnum;
    const payload = createEventDto.payload;
    const organizerId = createEventDto.organizerId;

    const newEvent = await this.prisma.event.create({
      data: {
        type,
        payload,
        organizerId,
      },
    });

    return newEvent;
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
