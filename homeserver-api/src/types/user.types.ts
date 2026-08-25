export interface CreatedUser {
  email: string;
  name: string;
  lastname: string;
  createdAt: Date;
}

export interface User {
  email: string;
  name: string;
  lastname: string;
  createdAt: String;
}

export interface Credentials {
  userId: number;
}
