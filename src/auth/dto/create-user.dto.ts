// TypeScript interfaces are removed during the transpilation, Nest can't refer to them at runtime

export class CreateUserDto {
  readonly fullName: string;
  readonly emailId: string;
  readonly phoneNumber: number;
  readonly username: number;
  readonly password: string;
  readonly confirmPassword: number;
  // readonly city: string;
  // readonly country: string;
}
