import {Request, Response} from 'express';
import { UserService } from '../services/UserService';

export class UsersController {
    private userService: UserService;
  
    constructor() {
      this.userService = new UserService();
    }



    async testandoDanger(req: Request, res: Response, next: Function) {
        try{
            const { name, email, password } = req.body
            const createdUser = await this.userService.createUser({name, email, password})
            
            return res.status(200).json(createdUser)
        }
        catch(err){
            res.status(400).json({ message: err})
        }
    }

    async create(req: Request, res: Response, next: Function) {
        try{
            const { name, email, password } = req.body
            const createdUser = await this.userService.createUser({name, email, password})
            
            return res.status(200).json(createdUser)
        }
        catch(err){
            res.status(400).json({ message: err})
        }
    }

    async getUserById(req: Request, res: Response, next: Function) {
        try{
            const { id } = req.params
            const user = await this.userService.getUserById({id})
            
            return res.status(200).json(user)
        }
        catch(err){
            res.status(400).json({ message: err})
        }
    }

    async createSession(req: Request, res: Response, next: Function) {
        try{
            const { email, password } = req.body
            const createSession = await this.userService.createSession({email, password})
            
            return res.status(200).json(createSession)
        }
        catch(err){
            res.status(400).json({ message: err})
        }
    }
}