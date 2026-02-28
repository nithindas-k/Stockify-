import * as express from 'express';

export interface IAuthController {
    login(req: express.Request, res: express.Response): Promise<void>;
    register(req: express.Request, res: express.Response): Promise<void>;
}
