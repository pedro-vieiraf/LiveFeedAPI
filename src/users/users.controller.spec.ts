import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: '123456',
        name: 'Test User',
        bio: 'Bio here',
      };

      const mockResult = { id: '1', ...dto };
      mockUsersService.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto);

      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: '1', email: 'one@test.com', username: 'user1' },
        { id: '2', email: 'two@test.com', username: 'user2' },
      ];
      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(mockUsersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const mockUser = { id: '1', email: 'test@test.com', username: 'user1' };
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should call service.update and return the result', async () => {
      const dto: UpdateUserDto = { name: 'Updated User' };
      const mockUser = { id: '1', name: 'Updated User' };

      mockUsersService.update.mockResolvedValue(mockUser);

      const result = await controller.update('1', dto);

      expect(mockUsersService.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return void', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(mockUsersService.remove).toHaveBeenCalledWith('1');
      expect(result).toBeUndefined();
    });
  });
});
