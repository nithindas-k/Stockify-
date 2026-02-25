import { IUser } from '../models/User';
import { UserDTO } from '../dtos/AuthDTO';

export class UserMapper {
    static toDTO(user: IUser): UserDTO {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }
}
