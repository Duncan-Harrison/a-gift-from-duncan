import { ReactNode, createContext, useState } from 'react';
// import {removeAuth, saveAuth} from "data.ts"

export type User = {
  userId: number;
  username: string;
};

export type UserContextValues = {
  user: User | undefined;
  token: string | undefined;
  handleSignIn: (user: User, token: string) => void;
  handleSignOut: () => void;
};

export const UserContext = createContext<UserContextValues>({
  user: undefined,
  token: undefined,
  handleSignIn: () => {
    throw new Error('No UserProvider');
  },
  handleSignOut: () => {
    throw new Error('No UserProvider');
  },
});

type Props = {
  children: ReactNode;
};

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  function handleSignIn(user: User, token: string) {
    setUser(user);
    setToken(token);
    saveAuth(user, token);
  }
}
