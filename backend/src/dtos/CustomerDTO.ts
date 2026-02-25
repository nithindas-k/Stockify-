export interface CreateCustomerDTO {
    name: string;
    address: string;
    mobile: string;
}

export interface UpdateCustomerDTO {
    name?: string;
    address?: string;
    mobile?: string;
}
