export interface UserSignIn {
  email: string;
  password: string;
}

export interface UserSignUp extends UserSignIn {
  name: string;
}
