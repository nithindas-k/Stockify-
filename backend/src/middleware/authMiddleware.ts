import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCode } from '../enums/StatusCode';

export interface AuthRequest extends Request {
    user: {
        id: string;
        email?: string;
        name?: string;
        [key: string]: any;
    };
}

export const protect = (req: Request, res: Response, next: NextFunction): void => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            if (!token) {
                throw new Error('Not authorized, token failed');
            }
            const secret: string = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || 'fallback_secret';
            const decoded = jwt.verify(token, secret) as any;
            (req as any).user = decoded;
            next();
        } catch (error) {
            res.status(StatusCode.UNAUTHORIZED).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(StatusCode.UNAUTHORIZED).json({ message: 'Not authorized, no token' });
    }
};

