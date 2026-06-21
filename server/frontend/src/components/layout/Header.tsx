import "@/assets/bootstrap.min.css";
import "@/assets/style.css";
import { useLogoutMutation } from "@/hooks/useAuth";
import { useAuthentication } from "@/provider";
import { useCallback } from "react";
import { Link } from "react-router";

const Header = () => {
  const logoutMutation = useLogoutMutation();
  const {
    state: { isAuthenticated, user },
  } = useAuthentication();

  const logout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    try {
      const username = sessionStorage.getItem("username");
      await logoutMutation.mutateAsync();
      window.location.href = window.location.origin;
      window.location.reload();
      alert("Logging out " + username + "...");
    } catch {
      alert("The user could not be logged out.");
    }
  };

  const renderHomePageItems = useCallback(() => {
    if (isAuthenticated) {
      console.log("user", user);

      return (
        <div className="flex gap-2">
          <span className="flex items-center font-medium text-amber-300">
            {user?.username}
          </span>
          <Link className="nav_item" to="/djangoapp/logout" onClick={logout}>
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Link>
        </div>
      );
    } else {
      return (
        <div className="flex gap-2">
          <Link className="nav_item" to="/auth/login">
            Login
          </Link>
          <Link className="nav_item" to="/auth/register">
            Register
          </Link>
        </div>
      );
    }
  }, [isAuthenticated, user]);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light shadow-sm gap-5 px-5"
      style={{ backgroundColor: "white" }}
    >
      <h2>Dealerships</h2>

      <div className="w-full flex" id="navbarText">
        <ul className="w-full flex-1 p-0 flex mb-2 mb-lg-0 text-gray-600">
          <li className="ml-2 flex items-center">
            <Link
              className="text-decoration-none active"
              style={{ fontSize: "larger" }}
              aria-current="page"
              to="/"
            >
              Home
            </Link>
          </li>
          <li className="ml-2 flex items-center">
            <Link
              className="text-decoration-none"
              style={{ fontSize: "larger" }}
              to="/about"
            >
              About Us
            </Link>
          </li>
          <li className="ml-2 flex items-center">
            <Link
              className="text-decoration-none"
              style={{ fontSize: "larger" }}
              to="/contact"
            >
              Contact Us
            </Link>
          </li>
        </ul>
        <span className="navbar-text ">
          <div className="loginlink" id="loginlogout">
            {renderHomePageItems()}
          </div>
        </span>
      </div>
    </nav>
  );
};

export default Header;
