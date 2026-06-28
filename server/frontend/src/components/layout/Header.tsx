import "@/assets/bootstrap.min.css";
import { useLogoutMutation } from "@/hooks/useAuth";
import { useAuthentication } from "@/provider";
import { useMemo } from "react";
import { Link, useLocation } from "react-router";

const Header = () => {
  const logoutMutation = useLogoutMutation();
  const { pathname = "" } = useLocation();

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

  const listNavItems = useMemo(() => {
    return [
      { name: "Home", href: "/", isActive: pathname === "/" },
      {
        name: "About Us",
        href: "/static/About.html",
        isActive: pathname === "/static/About.html",
      },
      {
        name: "Contact Us",
        href: "/static/Contact.html",
        isActive: pathname === "/static/Contact.html",
      },
    ];
  }, [pathname]);

  return (
    <nav className="navbar shadow-sm gap-5 px-5 flex navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <Link
          to="/"
          className="flex items-center decoration-0 text-black! hover:opacity-70"
        >
          <h2>Dealerships</h2>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse ml-5" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {listNavItems.map((item) => (
              <li className="nav-item" key={item.href}>
                <a
                  className={`nav-link ${item.isActive ? "active" : ""}`}
                  style={{ fontSize: "larger" }}
                  aria-current="page"
                  href={item.href}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
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
                <Link
                  className="nav_item btn btn-secondary"
                  to="/auth/register"
                >
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
