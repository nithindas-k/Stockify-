import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters"),
});

export const RegisterSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const SendOTPSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const VerifyOTPSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

export type LoginDTO = z.infer<typeof LoginSchema>;
export type RegisterDTO = z.infer<typeof RegisterSchema>;
export type SendOTPDTO = z.infer<typeof SendOTPSchema>;
export type VerifyOTPDTO = z.infer<typeof VerifyOTPSchema>;

export interface UserDTO {
    id: string;
    name: string;
    email: string;
    role: string;
}


export interface AuthResponseDTO {
    user: UserDTO;
    token: string;
    message: string;
}

