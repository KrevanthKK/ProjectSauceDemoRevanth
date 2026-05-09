import { faker } from '@faker-js/faker';

// Interface use panni shape define pandrom (as we discussed before!)
export interface UserData {
    firstName: string;
    lastName: string;
    zipcode: string;
  
}

export class FakerUtils {
    static generateUserData(): UserData {
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            zipcode: faker.location.zipCode()
        };
    }
}