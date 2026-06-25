import type { User } from "@/types/user.type";
import { useMemo, useState } from "react";

import {
  AuthContext,
  initialAuthState,
  type AuthProviderState,
} from "./AuthContext";

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<AuthProviderState>(() => {
    const username = sessionStorage.getItem("username");

    if (!username) {
      return initialAuthState;
    }

    return {
      isAuthenticated: true,
      user: {
        username,
        firstName: sessionStorage.getItem("firstname") || "",
        lastName: sessionStorage.getItem("lastname") || "",
        email: "",
      },
    };
  });

  const login = (user: Partial<User>) => {
    setState({
      isAuthenticated: true,
      user: { ...initialAuthState.user, ...user } as User,
    });
  };

  const logout = () => {
    setState({
      isAuthenticated: false,
      user: null,
    });
  };

  const contextValue = useMemo(
    () => ({
      state: {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      },
      login,
      logout,
    }),
    [state],
  );
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
