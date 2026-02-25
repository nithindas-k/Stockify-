import * as express from 'express';

export interface IProductController {
    create(req: express.Request, res: express.Response): Promise<void>;
    getAll(req: express.Request, res: express.Response): Promise<void>;
    getById(req: express.Request, res: express.Response): Promise<void>;
    update(req: express.Request, res: express.Response): Promise<void>;
    delete(req: express.Request, res: express.Response): Promise<void>;
    getLowStock(req: express.Request, res: express.Response): Promise<void>;
}
