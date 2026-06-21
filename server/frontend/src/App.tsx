import { AuthProvider } from "./provider";

export default function App({ children }: { children: React.ReactNode }) {
  const curr_user = sessionStorage.getItem("username");
  const initialAuthState = {
    isAuthenticated: curr_user !== null && curr_user !== "",
    user: null,
  };

  return <AuthProvider value={initialAuthState}>{children}</AuthProvider>;
}
