import User, { IUser } from '../models/User';
import { BaseRepository } from './BaseRepository';
import { IUserRepository } from './interfaces/IUserRepository';

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await this.model.findOne({ email }).exec();
    }
}
