import type { User } from "@/types/user.type";
import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

type AuthProviderState = {
  isAuthenticated: boolean;
  user: User | null;
};

const initialAuthState: AuthProviderState = {
  isAuthenticated: false,
  user: null,
};

const AuthContext = createContext<{
  state: AuthProviderState;
  login: (user: User) => void;
  logout: () => void;
}>({
  state: initialAuthState,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: AuthProviderState;
}) => {
  const [state, setState] = useState<AuthProviderState>(initialAuthState);

  useLayoutEffect(() => {
    const isAuthenticated = sessionStorage.getItem("username") !== null;

    if (isAuthenticated) {
      const user: User = {
        username: sessionStorage.getItem("username") || "",
        firstName: sessionStorage.getItem("firstname") || "",
        lastName: sessionStorage.getItem("lastname") || "",
        email: "",
      };

      setState({
        isAuthenticated: true,
        user,
      });
    }

    return () => {
      setState(initialAuthState);
    };
  }, [value]);

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
    [value, state],
  );
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthentication = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthentication must be used within an AuthProvider");
  }
  return context;
};
