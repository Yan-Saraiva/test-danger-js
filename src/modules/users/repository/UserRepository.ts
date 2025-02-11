import { Repository } from "typeorm";
import { User } from "../../../entities/User";
import { AppDataSource } from "../../../database";

export class UserRepository {
    private userRepository: Repository<User>;
  
    constructor() {
      this.userRepository = AppDataSource.getRepository(User)
    }
  
    public async createUser(userData: { name: string, email: string, password: string }): Promise<User> {
        const user = this.userRepository.create(userData);  
        return await this.userRepository.save(user);  
    }

    public async getUserById(id:string): Promise<User | null> {
      const user = await this.userRepository.findOneBy({id});  
      return user;
  }

  public async getUserByEmail(email:string): Promise<User | null> {
    const user = await this.userRepository.findOne({where: {
      email: email
    }
  });  
    return user;
  }
  
}