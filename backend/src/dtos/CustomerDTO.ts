import { z } from 'zod';

export const CreateCustomerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').regex(/^[a-zA-Z\s]+$/, 'Name should only contain letters and spaces'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    mobile: z.string().length(10, 'Mobile number must be exactly 10 digits').regex(/^\d+$/, 'Mobile number must contain only digits'),
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

export type CreateCustomerDTO = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerDTO = z.infer<typeof UpdateCustomerSchema>;

export interface CustomerResponseDTO {
    id: string;
    name: string;
    mobile: string;
    address: string;
    createdAt: string;
    updatedAt: string;
}
