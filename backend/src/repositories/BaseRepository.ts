import { Model, Document } from 'mongoose';
import { IBaseRepository } from './interfaces/IBaseRepository';

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async findAll(): Promise<T[]> {
        return await this.model.find().exec();
    }

    async findById(id: string): Promise<T | null> {
        return await this.model.findById(id).exec();
    }

    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data);
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id).exec();
        return result !== null;
    }
}
