import * as express from 'express';
import { IAuthController } from './interfaces/IAuthController';
import { IAuthService } from '../services/interfaces/IAuthService';
import { LoginSchema, RegisterSchema, SendOTPSchema, VerifyOTPSchema } from '../dtos/AuthDTO';
import { APP_MESSAGES } from '../constants/constants';

export class AuthController implements IAuthController {
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    async login(req: express.Request, res: express.Response): Promise<void> {
        try {
            const validatedData = LoginSchema.parse(req.body);
            const result = await this.authService.login(validatedData);
            res.status(200).json(result);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({ message: 'Validation failed', errors: error.errors });
                return;
            }
            res.status(401).json({ message: error.message || APP_MESSAGES.SERVER_ERROR });
        }
    }

    async register(req: express.Request, res: express.Response): Promise<void> {
        try {
            const validatedData = RegisterSchema.parse(req.body);
            const result = await this.authService.register(validatedData);
            res.status(201).json(result);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({ message: 'Validation failed', errors: error.errors });
                return;
            }
            res.status(400).json({ message: error.message || APP_MESSAGES.SERVER_ERROR });
        }
    }

    async sendOTP(req: express.Request, res: express.Response): Promise<void> {
        try {
            const validatedData = SendOTPSchema.parse(req.body);
            await this.authService.sendOTP(validatedData.email);
            res.status(200).json({ message: 'OTP sent successfully' });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({ message: 'Validation failed', errors: error.errors });
                return;
            }
            res.status(400).json({ message: error.message || APP_MESSAGES.SERVER_ERROR });
        }
    }

    async verifyOTP(req: express.Request, res: express.Response): Promise<void> {
        try {
            const validatedData = VerifyOTPSchema.parse(req.body);
            const result = await this.authService.verifyOTPAndRegister(validatedData);
            res.status(201).json(result);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({ message: 'Validation failed', errors: error.errors });
                return;
            }
            res.status(400).json({ message: error.message || APP_MESSAGES.SERVER_ERROR });
        }
    }
}


