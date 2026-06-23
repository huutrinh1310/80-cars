import { useState } from "react";

import Header from "@/components/layout/Header";
import { paths } from "@/endpoints";
import { useLoginMutation } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router";
import { useAuthentication } from "@/provider";
import type { User } from "@/types/user.type";

export const Login = () => {
  const [user, setUser] = useState<{
    userName: string;
    password: string;
  }>({
    userName: "",
    password: "",
  });
  const loginMutation = useLoginMutation();
  const { login } = useAuthentication();
  const navigate = useNavigate();

  // Redirect to home
  const gohome = () => {
    navigate(paths.home);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = await loginMutation.mutateAsync({
        username: user.userName,
        password: user.password,
      });

      login({
        username: data.userName || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
      } as User);
      gohome();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The user could not be authenticated.";
      alert(message);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=" modalContainer shadow-sm m-auto p-5 border-2 border-gray-300 rounded-lg bg-white"
      >
        <label className="text-2xl font-bold mb-4 text-center">Login</label>
        <form className="flex flex-col gap-4" style={{}} onSubmit={handleLogin}>
          <div className="flex items-center justify-between">
            <span className="font-medium mr-2">Username </span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="border-2 border-gray-300 rounded-md p-2"
              onChange={(e) => setUser({ ...user, userName: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium mr-2">Password </span>
            <input
              name="psw"
              type="password"
              placeholder="Password"
              className="border-2 border-gray-300 rounded-md p-2"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <div className="flex justify-center items-center gap-2">
            <input
              className="btn btn-primary"
              type="submit"
              value={loginMutation.isPending ? "Logging in..." : "Login"}
              disabled={loginMutation.isPending}
            />
            <input
              className="btn btn-secondary"
              type="button"
              value="Cancel"
              onClick={() => navigate(paths.home)}
            />
          </div>
          <Link className="flex justify-start" to={paths.auth.register}>
            Register Now
          </Link>
        </form>
      </div>
    </div>
  );
};
