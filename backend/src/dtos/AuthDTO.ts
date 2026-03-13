import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter")
        .regex(/[a-z]/, "Password must include at least one lowercase letter")
        .regex(/\d/, "Password must include at least one number")
        .regex(/[@$!%*?&]/, "Password must include at least one special character (@$!%*?&)"),
});


export type LoginDTO = z.infer<typeof LoginSchema>;
export type RegisterDTO = z.infer<typeof RegisterSchema>;


export interface UserDTO {
    id: string;
    name: string;
    email: string;
}


export interface AuthResponseDTO {
    user: UserDTO;
    token: string;
    message: string;
}

