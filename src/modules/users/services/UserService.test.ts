import { UserService } from './UserService';
import { UserRepository } from '../repository/UserRepository';
import { AppError } from '../../../utils/AppError';

jest.mock('../repository/UserRepository');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService(userRepository);

    userRepository.createUser = jest.fn();
    userRepository.getUserByEmail = jest.fn();
  });

  it('should create a user', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$bMTVNH8G5/nrOLY3uOCXmA$bBi/6qle/tLJXiY2ell1RMJVV9wNoD8bBhkG4d42csY',
      createdAt: new Date(),
    };

    userRepository.createUser.mockResolvedValue(mockUser);
    userRepository.getUserByEmail.mockResolvedValue(null);

    const user = await userService.createUser({
      name: 'John Doe',
      password: 'password123',
      email: 'john@example.com',
    });

    expect(user).toEqual(mockUser);
    expect(userRepository.createUser).toHaveBeenCalledWith({
      name: 'John Doe',
      password: expect.any(String),
      email: 'john@example.com',
    });
  });

  it('should throw error if user with email already exists', async () => {
    userRepository.getUserByEmail.mockResolvedValue({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
    });

    try {
      await userService.createUser({
        name: 'John Doe',
        password: 'password123',
        email: 'john@example.com',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).message).toBe(
        'Já existe um usuário cadastrado com esse email!',
      );
    }
  });
  //   it('should throw error if user already exists', async () => {
  //     userRepository.getUserByEmail.mockResolvedValue({
  //       id: '1',
  //       name: 'John Doe',
  //       email: 'john@example.com',
  //       password: 'hashed-password',
  //       createdAt: new Date(),
  //     });

  //     await expect(
  //       userService.createUser({
  //         name: 'John Doe',
  //         password: 'password123',
  //         email: 'john@example.com',
  //       }),
  //     ).rejects.toThrow(
  //       new AppError('Já existe um usuário cadastrado com esse email!', 401),
  //     );
  //   });

  //   it('should get a user by id', async () => {
  //     const mockUser = {
  //       id: '1',
  //       name: 'John Doe',
  //       email: 'john@example.com',
  //       password: 'hashed-password',
  //       createdAt: new Date(),
  //     };

  //     userRepository.getUserById.mockResolvedValue(mockUser);

  //     const user = await userService.getUserById({ id: '1' });

  //     expect(user).toEqual(mockUser);
  //   });

  //   it('should throw error if user not found by id', async () => {
  //     userRepository.getUserById.mockResolvedValue(null);

  //     await expect(userService.getUserById({ id: '1' })).rejects.toThrow(
  //       new AppError('Usuário não encontrado!', 400),
  //     );
  //   });

  //   it('should create a session', async () => {
  //     const mockUser = {
  //       id: '1',
  //       email: 'john@example.com',
  //       password: 'hashed-password',
  //       name: 'john',
  //       createdAt: new Date(),
  //     };

  //     userRepository.getUserByEmail.mockResolvedValue(mockUser);

  //     const { user, token } = await userService.createSession({
  //       email: 'john@example.com',
  //       password: 'password123',
  //     });

  //     expect(user).toEqual(mockUser);
  //     expect(token).toBeDefined();
  //   });

  //   it('should throw error if password is incorrect', async () => {
  //     const mockUser = {
  //       id: '1',
  //       email: 'john@example.com',
  //       password: 'hashed-password',
  //       name: 'john',
  //       createdAt: new Date(),
  //     };

  //     userRepository.getUserByEmail.mockResolvedValue(mockUser);

  //     await expect(
  //       userService.createSession({
  //         email: 'john@example.com',
  //         password: 'wrongpassword',
  //       }),
  //     ).rejects.toThrow(new AppError('Senha errada!', 401));
  //   });
});
