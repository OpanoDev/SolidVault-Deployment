export interface Address {
  readonly address_line: string;
  readonly city: string;
  readonly country: string;
}

export interface UserPlan {
  readonly plan: string;
  readonly group: string;
}

export interface UserSignup {
  readonly fullName: string;
  readonly emailId: string;
  readonly phoneNumber: number;
  readonly username: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly address: Address;
  readonly current_plan: UserPlan;
}
