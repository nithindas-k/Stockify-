import * as express from 'express';
import { IAuthController } from './interfaces/IAuthController';
import { IAuthService } from '../services/interfaces/IAuthService';
import { LoginSchema, RegisterSchema } from '../dtos/AuthDTO';
import { APP_MESSAGES } from '../constants/constants';
import { StatusCode } from '../enums/StatusCode';

export class AuthController implements IAuthController {
    private _authService: IAuthService;

    constructor(authService: IAuthService) {
        this._authService = authService;
    }

    login = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const validatedData = LoginSchema.parse(req.body);
            const result = await this._authService.login(validatedData);
            res.status(StatusCode.OK).json(result);
        } catch (error: unknown) {
            const err = error as any;
            if (err.name === 'ZodError') {
                const errorMessage = err.errors[0]?.message || 'Validation failed';
                res.status(StatusCode.BAD_REQUEST).json({ message: errorMessage, errors: err.errors });
                return;
            }
            res.status(StatusCode.UNAUTHORIZED).json({ message: err.message || APP_MESSAGES.SERVER_ERROR });
        }
    };

    register = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const validatedData = RegisterSchema.parse(req.body);
            const result = await this._authService.register(validatedData);
            res.status(StatusCode.CREATED).json(result);
        } catch (error: unknown) {
            const err = error as any;
            if (err.name === 'ZodError') {
                const errorMessage = err.errors[0]?.message || 'Validation failed';
                res.status(StatusCode.BAD_REQUEST).json({ message: errorMessage, errors: err.errors });
                return;
            }
            res.status(StatusCode.BAD_REQUEST).json({ message: err.message || APP_MESSAGES.SERVER_ERROR });
        }
    };
}
