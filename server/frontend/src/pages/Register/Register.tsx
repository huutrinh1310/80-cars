import { useState } from "react";
import Header from "@/components/layout/Header";
import { paths } from "@/endpoints";
import { useRegisterMutation } from "@/hooks/useAuth";
import { Link } from "react-router";

export const Register = () => {
  const [userRegister, setUserRegister] = useState({
    userName: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [open, setOpen] = useState(true);
  const registerMutation = useRegisterMutation();

  // Redirect to home
  const gohome = () => {
    window.location.href = paths.home;
  };

  // Handle form submission
  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await registerMutation.mutateAsync(userRegister);
      gohome();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "The user could not be registered.";

      if (message === "Already Registered") {
        alert("The user with same username is already registered");
      } else {
        alert(message);
      }
    }
  };

  if (!open) {
    gohome();
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modalContainer shadow-sm m-auto p-5 border-2 border-gray-300 rounded-lg bg-white"
      >
        <label className="text-2xl font-bold mb-4 text-center">Register</label>
        <form className="flex flex-col gap-4" onSubmit={register}>
          <div className="flex items-center justify-between">
            <span className="font-medium mr-2">Username </span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="border-2 border-gray-300 rounded-md p-2"
              onChange={(e) =>
                setUserRegister({ ...userRegister, userName: e.target.value })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium mr-2">First Name </span>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              className="border-2 border-gray-300 rounded-md p-2"
              onChange={(e) =>
                setUserRegister({ ...userRegister, firstName: e.target.value })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium mr-2">Last Name </span>
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              className="border-2 border-gray-300 rounded-md p-2"
              onChange={(e) =>
                setUserRegister({ ...userRegister, lastName: e.target.value })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium mr-2">Email </span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border-2 border-gray-300 rounded-md p-2"
              onChange={(e) =>
                setUserRegister({ ...userRegister, email: e.target.value })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium mr-2">Password </span>
            <input
              name="psw"
              type="password"
              placeholder="Password"
              className="border-2 border-gray-300 rounded-md p-2"
              onChange={(e) =>
                setUserRegister({ ...userRegister, password: e.target.value })
              }
            />
          </div>
          <div className="flex justify-center items-center gap-2">
            <input
              className="btn btn-primary"
              type="submit"
              value={registerMutation.isPending ? "Registering..." : "Register"}
              disabled={registerMutation.isPending}
            />
            <input
              className="btn btn-secondary"
              type="button"
              value="Cancel"
              onClick={() => setOpen(false)}
            />
          </div>
          <Link className="flex justify-start" to={paths.auth.login}>
            Already have an account? Login
          </Link>
        </form>
      </div>
    </div>
  );
};
