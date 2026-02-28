import * as express from 'express';
import { IAuthController } from './interfaces/IAuthController';
import { IAuthService } from '../services/interfaces/IAuthService';
import { LoginSchema, RegisterSchema } from '../dtos/AuthDTO';
import { APP_MESSAGES } from '../constants/constants';

export class AuthController implements IAuthController {
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    login = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const validatedData = LoginSchema.parse(req.body);
            const result = await this.authService.login(validatedData);
            res.status(200).json(result);
        } catch (error: unknown) {
            const err = error as any;
            if (err.name === 'ZodError') {
                const errorMessage = err.errors[0]?.message || 'Validation failed';
                res.status(400).json({ message: errorMessage, errors: err.errors });
                return;
            }
            res.status(401).json({ message: err.message || APP_MESSAGES.SERVER_ERROR });
        }
    };

    register = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const validatedData = RegisterSchema.parse(req.body);
            const result = await this.authService.register(validatedData);
            res.status(201).json(result);
        } catch (error: unknown) {
            const err = error as any;
            if (err.name === 'ZodError') {
                const errorMessage = err.errors[0]?.message || 'Validation failed';
                res.status(400).json({ message: errorMessage, errors: err.errors });
                return;
            }
            res.status(400).json({ message: err.message || APP_MESSAGES.SERVER_ERROR });
        }
    };
}
