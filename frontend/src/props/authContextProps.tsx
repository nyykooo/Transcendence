import { type User } from './userProps';
import { type LoginProps, type LoginResponse } from './loginProps';

export type AuthContextType = {
  user: User | null;
  signIn: (login?: LoginProps, option?: string) => Promise<LoginResponse | void>;
  completeTwoFactorSignIn: (twoFactorToken: string, otp: string) => Promise<LoginResponse>;
  signOut: () => void;
  getAuthToken: () => string | null;
  getAuthRole: () => string | null;
};