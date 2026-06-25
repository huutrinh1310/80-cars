import "@/assets/bootstrap.min.css";
import { useLogoutMutation } from "@/hooks/useAuth";
import { useAuthentication } from "@/provider";
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

  return (
    <nav className="navbar shadow-sm gap-5 px-5 flex">
      <Link to="/" className="flex items-center decoration-0 text-black! hover:opacity-70">
        <h2>Dealerships</h2>
      </Link>

      <div className="flex " id="navbarText">
        <span className="navbar-text ">
          <div className="loginlink" id="loginlogout">
            {isAuthenticated ? (
              <div className="flex gap-2">
                <span className="flex items-center font-medium text-amber-300">
                  {user?.username}
                </span>
                <Link
                  className="nav_item btn btn-primary"
                  to="/djangoapp/logout"
                  onClick={logout}
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Link>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link className="nav_item btn btn-primary" to="/auth/login">
                  Login
                </Link>
                <Link className="nav_item btn btn-secondary" to="/auth/register">
                  Register
                </Link>
              </div>
            )}
          </div>
        </span>
      </div>
    </nav>
  );
};

export default Header;
