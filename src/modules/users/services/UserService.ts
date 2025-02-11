import { UserRepository } from '../repository/UserRepository';
import { User } from '../../../entities/User';
import { AppError } from '../../../utils/AppError';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

interface ICreateUserDTO {
  name: string;
  password: string;
  email: string;
}

interface IGetUserById {
  id: string;
}

interface ICreateSession {
  email: string;
  password: string;
}

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser({
    name,
    password,
    email,
  }: ICreateUserDTO): Promise<User | null> {
    try {
      if (!name) {
        throw new AppError('Dados inválidos!', 401);
      }

      if (!password) {
        throw new AppError('Dados inválidos!', 401);
      }

      if (!email) {
        throw new AppError('Dados inválidos!', 401);
      }

      const findUser = await this.userRepository.getUserByEmail(email);

      if (findUser) {
        throw new AppError(
          'Já existe um usuário cadastrado com esse email!',
          401,
        );
      }

      const hashPassword = await argon2.hash(password);
      const user = {
        name,
        password: hashPassword,
        email,
      };
      const createUser = await this.userRepository.createUser(user);

      return createUser;
    } catch (err) {
      throw new AppError('Erro ao criar nova conta!', 400);
    }
  }

  async getUserById({ id }: IGetUserById): Promise<User | null> {
    try {
      if (!id) {
        throw new AppError('Não foi encontrado ID.', 404);
      }

      const user = await this.userRepository.getUserById(id);

      if (!user) {
        throw new AppError('Usuário não encontrado!', 400);
      }

      return user;
    } catch (err) {
      throw new AppError('Erro ao tentar buscar usuário pelo ID!', 400);
    }
  }

  async createSession({ email, password }: ICreateSession) {
    try {
      if (!email) {
        throw new AppError('Não foi fornecido email.', 404);
      }

      if (!password) {
        throw new AppError('Não foi fornecido senha.', 404);
      }

      const user = await this.userRepository.getUserByEmail(email);

      if (!user) {
        throw new AppError('Usuário não encontrado!', 400);
      }

      const verifyPassword = await argon2.verify(user.password, password);

      if (!verifyPassword) {
        throw new AppError('Senha errada!', 401);
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        'aprendendo jwt' as string,
        {
          expiresIn: '1h',
        },
      );

      return { user, token };
    } catch (err) {
      throw new AppError('Erro ao tentar buscar usuário pelo ID!', 400);
    }
  }
}
