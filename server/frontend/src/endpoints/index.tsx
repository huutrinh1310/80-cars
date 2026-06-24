import { Home, Login, Register } from "@/pages";
import Dealer from "@/pages/Dealers/Dealer";
import Dealers from "@/pages/Dealers/Dealers";
import PostReview from "@/pages/Dealers/PostReview";
import type { RouteObject } from "react-router";

interface EndpointsType {
  [key: string]: Omit<RouteObject, "children"> & {
    children?: EndpointsType[];
    isAuthenticated?: boolean;
  };
}

export const paths = {
  home: "/",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  dealers: {
    root: "/dealers",
    detail: "/dealer/:id",
  },
  postreview: {
    root: "/postreview/:id",
  },
};

export const endpoints: EndpointsType = {
  home: {
    element: <Home />,
    path: paths.home,
    isAuthenticated: true,
  },
  auth: {
    path: paths.auth.login.split("/").slice(0, -1).join("/"),
    children: [
      {
        login: {
          element: <Login />,
          path: paths.auth.login.split("/").slice(-1)[0],
          isAuthenticated: false,
        },
        register: {
          element: <Register />,
          path: paths.auth.register.split("/").slice(-1)[0],
          isAuthenticated: false,
        },
      },
    ],
  },
  dealers: {
    path: paths.dealers.root,
    element: <Dealers />,
    isAuthenticated: true,
  },
  dealer: {
    element: <Dealer />,
    path: paths.dealers.detail,
    isAuthenticated: true,
  },
  postreview: {
    path: paths.postreview.root,
    element: <PostReview />,
    isAuthenticated: true,
  },
};

export function getEndpoints(endpoints: EndpointsType) {
  return Object.values(endpoints).map((route) => {
    const routeItem: RouteObject = { path: route.path };
    if (route.element) routeItem.element = route.element;
    if (route.children) {
      routeItem.children = route.children.flatMap((childGroup) =>
        getEndpoints(childGroup),
      );
    }
    return routeItem;
  });
}
