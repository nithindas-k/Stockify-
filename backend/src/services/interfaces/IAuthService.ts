import { LoginDTO, AuthResponseDTO, RegisterDTO } from '../../dtos/AuthDTO';

export interface IAuthService {
    login(credentials: LoginDTO): Promise<AuthResponseDTO>;
    register(userData: RegisterDTO): Promise<AuthResponseDTO>;
}


