import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('EventsService', () => {
  let service: EventsService;

  const mockPrismaService = {
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create an event', async () => {
      const createEventDto = {
        type: 'POST_CREATED',
        payload: { postId: 'post-1' },
        userId: 'user-1',
      };
      const mockAuthor = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'tester',
        name: 'Tester',
        bio: 'Bio here',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockEvent = {
        id: 'event-1',
        type: createEventDto.type,
        payload: createEventDto.payload,
        user: mockAuthor,
        createdAt: new Date(),
      };

      mockPrismaService.event.create.mockResolvedValue(mockEvent);

      const result = await service.create(createEventDto);
    });
  });
});
