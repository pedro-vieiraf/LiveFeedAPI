import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('PostsService', () => {
  let service: PostsService;

  const mockPrismaService = {
    post: {
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
        PostsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto = {
        id: '1',
        content: 'This is a test post',
        imageUrl: '',
        authorId: 'user-1',
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

      const mockPost = {
        id: 'post-1',
        content: createPostDto.content,
        imageUrl: createPostDto.imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: mockAuthor,
        authorId: createPostDto.authorId,
      };

      mockPrismaService.post.create.mockResolvedValue(mockPost);

      const result = await service.create(createPostDto);

      expect(result).toEqual(
        expect.objectContaining({
          content: createPostDto.content,
          imageUrl: createPostDto.imageUrl,
          author: expect.objectContaining({
            id: mockAuthor.id,
            email: mockAuthor.email,
            username: mockAuthor.username,
            name: mockAuthor.name,
            bio: mockAuthor.bio,
            createdAt: mockAuthor.createdAt,
            updatedAt: mockAuthor.updatedAt,
          }) as object,
        }),
      );
      expect(mockPrismaService.post.create).toHaveBeenCalledWith({
        data: {
          content: createPostDto.content,
          imageUrl: createPostDto.imageUrl,
          author: {
            connect: { id: createPostDto.authorId },
          },
        },
        select: {
          id: true,
          content: true,
          imageUrl: true,
          author: true,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const mockAuthor = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'tester',
        name: 'Tester',
        bio: 'Bio here',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockPosts = [
        {
          id: 'post-1',
          content: 'First post',
          imageUrl: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          author: {
            id: mockAuthor.id,
            email: mockAuthor.email,
            username: mockAuthor.username,
            name: mockAuthor.name,
            bio: mockAuthor.bio,
            createdAt: mockAuthor.createdAt,
            updatedAt: mockAuthor.updatedAt,
          },
        },
        {
          id: 'post-2',
          content: 'Second post',
          imageUrl: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          author: {
            id: mockAuthor.id,
            email: mockAuthor.email,
            username: mockAuthor.username,
            name: mockAuthor.name,
            bio: mockAuthor.bio,
            createdAt: mockAuthor.createdAt,
            updatedAt: mockAuthor.updatedAt,
          },
        },
      ];

      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);

      const result = await service.findAll();

      expect(result).toEqual(
        expect.arrayContaining([mockPosts[0], mockPosts[1]]),
      );
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        include: { author: true },
      });
    });
  });
  describe('findOne', () => {
    it('should return a post by ID', async () => {
      const mockAuthor = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'tester',
        name: 'Tester',
        bio: 'Bio here',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockPost = {
        id: 'post-1',
        content: 'First post',
        imageUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: mockAuthor.id,
          email: mockAuthor.email,
          username: mockAuthor.username,
          name: mockAuthor.name,
          bio: mockAuthor.bio,
          createdAt: mockAuthor.createdAt,
          updatedAt: mockAuthor.updatedAt,
        },
      };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

      const result = await service.findOne('post-1');

      expect(result).toEqual(expect.objectContaining(mockPost));
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 'post-1' },
        include: { author: true },
      });
    });
  });
  describe('update', () => {
    it('should update a post', async () => {
      const mockAuthor = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'tester',
        name: 'Tester',
        bio: 'Bio here',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockPost = {
        id: 'post-1',
        content: 'First post',
        imageUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: mockAuthor.id,
          email: mockAuthor.email,
          username: mockAuthor.username,
          name: mockAuthor.name,
          bio: mockAuthor.bio,
          createdAt: mockAuthor.createdAt,
          updatedAt: mockAuthor.updatedAt,
        },
      };

      mockPrismaService.post.update.mockResolvedValue({
        ...mockPost,
        content: 'Updated content',
      });

      const result = await service.update('post-1', {
        content: 'Updated content',
      });

      expect(result).toEqual(
        expect.objectContaining({
          ...mockPost,
          content: 'Updated content',
        }),
      );
      expect(mockPrismaService.post.update).toHaveBeenCalledWith({
        where: { id: 'post-1' },
        data: { content: 'Updated content' },
      });
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const mockAuthor = {
        id: 'user-1',
        email: 'test@example.com',
        username: 'tester',
        name: 'Tester',
        bio: 'Bio here',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockPost = {
        id: 'post-1',
        content: 'First post',
        imageUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: mockAuthor.id,
          email: mockAuthor.email,
          username: mockAuthor.username,
          name: mockAuthor.name,
          bio: mockAuthor.bio,
          createdAt: mockAuthor.createdAt,
          updatedAt: mockAuthor.updatedAt,
        },
      };

      mockPrismaService.post.delete.mockResolvedValue(mockPost);

      const result = await service.remove('post-1');

      expect(result).toBeUndefined();
      expect(mockPrismaService.post.delete).toHaveBeenCalledWith({
        where: { id: 'post-1' },
      });
    });
  });
});
