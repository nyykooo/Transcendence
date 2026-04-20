import { type User } from './userProps';
import { type LoginProps } from './loginProps';

export type AuthContextType = {
  user: User | null;
  signIn: (login?: LoginProps, option?: string) => Promise<void>;
  signOut: () => void;
  getAuthToken: () => string | null;
  getAuthRole: () => string | null;
};