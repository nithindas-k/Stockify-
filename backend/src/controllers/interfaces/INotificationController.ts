import * as express from 'express';

export interface INotificationController {
    getAll(req: express.Request, res: express.Response): Promise<void>;
    clearAll(req: express.Request, res: express.Response): Promise<void>;
}
