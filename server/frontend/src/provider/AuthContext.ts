import { createContext } from "react";

import type { User } from "@/types/user.type";

export type AuthProviderState = {
  isAuthenticated: boolean;
  user: User | null;
};

export const initialAuthState: AuthProviderState = {
  isAuthenticated: false,
  user: null,
};

export const AuthContext = createContext<{
  state: AuthProviderState;
  login: (user: User) => void;
  logout: () => void;
}>({
  state: initialAuthState,
  login: () => {},
  logout: () => {},
});
