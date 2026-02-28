import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAuthService } from './interfaces/IAuthService';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { LoginDTO, AuthResponseDTO, RegisterDTO } from '../dtos/AuthDTO';
import { UserMapper } from '../mappers/UserMapper';
import { APP_MESSAGES } from '../constants/constants';

export class AuthService implements IAuthService {
    private userRepository: IUserRepository;
    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async login(credentials: LoginDTO): Promise<AuthResponseDTO> {
        const user = await this.userRepository.findByEmail(credentials.email);

        if (!user) {
            throw new Error('User not found. Please check your email.');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Incorrect password. Please try again.');
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '1d' }
        );

        return {
            user: UserMapper.toDTO(user),
            token,
            message: APP_MESSAGES.AUTH_SUCCESS,
        };
    }

    async register(userData: RegisterDTO): Promise<AuthResponseDTO> {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = await this.userRepository.create({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: newUser._id },
            process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '1d' }
        );

        return {
            user: UserMapper.toDTO(newUser),
            token,
            message: 'Registration successful',
        };
    }
}


