import { ICustomer } from '../models/Customer';
import { CustomerResponseDTO } from '../dtos/CustomerDTO';

export class CustomerMapper {
    static toDTO(customer: ICustomer): CustomerResponseDTO {
        return {
            id: customer._id.toString(),
            name: customer.name,
            mobile: customer.mobile,
            address: customer.address,
            createdAt: customer.createdAt.toISOString(),
            updatedAt: customer.updatedAt.toISOString(),
        };
    }
}
