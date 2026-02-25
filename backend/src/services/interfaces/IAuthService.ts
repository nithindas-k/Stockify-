import { LoginDTO, AuthResponseDTO, RegisterDTO, VerifyOTPDTO } from '../../dtos/AuthDTO';

export interface IAuthService {
    login(credentials: LoginDTO): Promise<AuthResponseDTO>;
    adminLogin(credentials: LoginDTO): Promise<AuthResponseDTO>;
    register(userData: RegisterDTO): Promise<AuthResponseDTO>;
    sendOTP(email: string): Promise<void>;
    verifyOTPAndRegister(verifyData: VerifyOTPDTO): Promise<AuthResponseDTO>;
}


