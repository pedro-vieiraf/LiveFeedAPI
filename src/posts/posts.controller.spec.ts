import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let controller: PostsController;

  const mockPostsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: mockPostsService }],
    }).compile();

    controller = module.get<PostsController>(PostsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto = {
        content: 'Test content',
        imageUrl: 'http://example.com/image.jpg',
        authorId: 'author-id',
      };

      const mockResult = { id: '1', ...dto };
      mockPostsService.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto);

      expect(mockPostsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResult);
    });
  });
  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const mockPosts = [
        { id: '1', content: 'Post 1', imageUrl: 'http://example.com/1.jpg' },
        { id: '2', content: 'Post 2', imageUrl: 'http://example.com/2.jpg' },
      ];
      mockPostsService.findAll.mockResolvedValue(mockPosts);

      const result = await controller.findAll();

      expect(mockPostsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockPosts);
    });
  });
  describe('findOne', () => {
    it('should return a single post by id', async () => {
      const mockPost = {
        id: '1',
        content: 'Post 1',
        imageUrl: 'http://example.com/1.jpg',
      };
      mockPostsService.findOne.mockResolvedValue(mockPost);

      const result = await controller.findOne('1');

      expect(mockPostsService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockPost);
    });
  });
  describe('update', () => {
    it('should update a post and return the updated post', async () => {
      const dto = { content: 'Updated content' };
      const mockUpdatedPost = {
        id: '1',
        content: 'Updated content',
        imageUrl: 'http://example.com/1.jpg',
      };

      mockPostsService.update.mockResolvedValue(mockUpdatedPost);

      const result = await controller.update('1', dto);

      expect(mockPostsService.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(mockUpdatedPost);
    });
  });
  describe('remove', () => {
    it('should call service.remove with the correct id', async () => {
      mockPostsService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(mockPostsService.remove).toHaveBeenCalledWith('1');
    });
  });
});
