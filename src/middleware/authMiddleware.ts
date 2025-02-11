import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface ITokenPayload {
    id:string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): any => {
    const authHeader = req.headers.authorization;


    if(!authHeader){
        return res.status(401).json({ message: 'Token não fornecido!' });
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
        return res.status(401).json({ message: 'Token inválido!' });
    }

    try {
        const decoded = jwt.verify(token, 'aprendendo jwt' as string) as ITokenPayload;

        return next(); 
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado!' });
    }
}