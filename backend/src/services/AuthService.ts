import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAuthService } from './interfaces/IAuthService';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { LoginDTO, AuthResponseDTO, RegisterDTO, VerifyOTPDTO } from '../dtos/AuthDTO';
import { UserMapper } from '../mappers/UserMapper';
import { APP_MESSAGES } from '../constants/constants';
import OTP from '../models/OTP';
import { MailService } from '../utils/MailService';

export class AuthService implements IAuthService {
    private userRepository: IUserRepository;
    private mailService: MailService;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
        this.mailService = new MailService();
    }

    async login(credentials: LoginDTO): Promise<AuthResponseDTO> {
        const user = await this.userRepository.findByEmail(credentials.email);

        if (!user) {
            throw new Error(APP_MESSAGES.AUTH_FAILED);
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new Error(APP_MESSAGES.AUTH_FAILED);
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'supersecretkey',
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
            role: 'user',
        });

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '1d' }
        );

        return {
            user: UserMapper.toDTO(newUser),
            token,
            message: 'Registration successful',
        };
    }

    async sendOTP(email: string): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Check if OTP was sent less than 1 minute ago
        const lastOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });
        if (lastOTP) {
            const timeDiff = (Date.now() - lastOTP.createdAt.getTime()) / 1000;
            if (timeDiff < 60) {
                throw new Error('Please wait 1 minute before resending OTP');
            }
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();


        await OTP.create({ email, otp: otpCode });


        await this.mailService.sendOTP(email, otpCode);
    }

    async verifyOTPAndRegister(verifyData: VerifyOTPDTO): Promise<AuthResponseDTO> {
        const otpRecord = await OTP.findOne({ email: verifyData.email, otp: verifyData.otp }).sort({ createdAt: -1 });

        if (!otpRecord) {
            throw new Error('Invalid or expired OTP');
        }

        const existingUser = await this.userRepository.findByEmail(verifyData.email);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(verifyData.password, 10);

        const newUser = await this.userRepository.create({
            name: verifyData.name,
            email: verifyData.email,
            password: hashedPassword,
            role: 'user',
        });

        await OTP.deleteMany({ email: verifyData.email });

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '1d' }
        );

        return {
            user: UserMapper.toDTO(newUser),
            token,
            message: 'Registration successful',
        };
    }
}


