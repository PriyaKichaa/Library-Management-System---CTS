// user.model.ts

// Step 1: Define the User class
export class User {
    // Step 2: Add a constructor with the necessary properties
    constructor(
      public memberId: string,
      public name: string,
      public username: string,
      public email: string,
      public phone: string,
      public address: string,
      public membershipStatus: string | null,
      public userType: string,
      public password:string
    ) {}
  }
  