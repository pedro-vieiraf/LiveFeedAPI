jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
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
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
  });

  describe('create', () => {
    it('should create a user', async () => {
      const mockUser = {
        id: '1',
        email: 'email@example2.com',
        username: 'testuser',
        password: 'hashedpassword',
        name: 'Test User',
        bio: 'This is a test user',
      };
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const createUserDto: CreateUserDto = {
        email: 'email@example2.com',
        username: 'testuser',
        password: 'password123',
        name: 'Test User',
        bio: 'This is a test user',
      };

      const result = await service.create(createUserDto);

      expect(result).toEqual(
        expect.objectContaining({
          email: createUserDto.email,
          username: createUserDto.username,
          name: createUserDto.name,
          bio: createUserDto.bio,
        }),
      );
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: expect.any(String) as string,
        },
      });
    });
    it('should hash the password when creating a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'plainPassword',
        name: 'Test User',
        bio: 'bio here',
      };

      const mockUser = {
        ...createUserDto,
        id: '1',
        password: 'hashedPassword123',
      };
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: 'hashedPassword123',
        },
      });

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(result).toEqual(
        expect.objectContaining({
          email: createUserDto.email,
          username: createUserDto.username,
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          id: '1',
          email: 'emailtest1@test.com',
          username: 'user1',
          password: 'hashedpassword1',
          name: 'User One',
          bio: 'Bio of user one',
          updatedAt: new Date(),
          createdAt: new Date(),
        },
        {
          id: '2',
          email: 'emailtest2@test.com',
          username: 'user2',
          password: 'hashedpassword2',
          name: 'User Two',
          bio: 'Bio of user two',
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      ];
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual([
        expect.objectContaining({
          id: '1',
          email: 'emailtest1@test.com',
          username: 'user1',
          name: 'User One',
          bio: 'Bio of user one',
        }),
        expect.objectContaining({
          id: '2',
          email: 'emailtest2@test.com',
          username: 'user2',
          name: 'User Two',
          bio: 'Bio of user two',
        }),
      ]);
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const mockUser = {
        id: '1',
        email: 'emailtest1@test.com',
        username: 'user1',
        password: 'hashedpassword1',
        name: 'User One',
        bio: 'Bio of user one',
        updatedAt: new Date(),
        createdAt: new Date(),
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(result).toEqual(
        expect.objectContaining({
          id: '1',
          email: 'emailtest1@test.com',
          username: 'user1',
          name: 'User One',
          bio: 'Bio of user one',
        }),
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const mockUser = {
        id: '1',
        email: 'emailtest1@test.com',
        username: 'usre1',
        password: 'hashedpassword1',
        name: 'User One',
        bio: 'Bio of user one',
        updatedAt: new Date(),
        createdAt: new Date(),
      };
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        username: 'user1',
      });

      const result = await service.update('1', { username: 'user1' });

      expect(result).toEqual(
        expect.objectContaining({
          id: '1',
          email: 'emailtest1@test.com',
          username: 'user1',
          name: 'User One',
          bio: 'Bio of user one',
        }),
      );
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { username: 'user1' },
      });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const mockUser = {
        id: '1',
        email: 'emailtest1@test.com',
        username: 'usre1',
        password: 'hashedpassword1',
        name: 'User One',
        bio: 'Bio of user one',
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.remove('1');

      expect(result).toBeUndefined();
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
