import { Navigate, createBrowserRouter } from "react-router-dom";
import Form from "../pages/form";
import WhatsAppDashboard from "../pages/wDashboard";
import Chats from "../pages/wDashboard/conponents/chats";
import Calls from "../pages/wDashboard/conponents/calls";
import Status from "../pages/wDashboard/conponents/status";
import StarredMessages from "../pages/wDashboard/conponents/starredMessages";
import ArchivedChats from "../pages/wDashboard/conponents/archiveChats";

const ProtectedRoutes = ({ children, auth = false }) => {
  const isLoggedIn = localStorage.getItem("user:token") !== null || false;

  if (!isLoggedIn && auth) {
    return <Navigate to={"/users/sign-in"} />;
  } else if (
    isLoggedIn &&
    ["/users/sign-in", "/users/sign-up"].includes(window.location.pathname)
  ) {
    return <Navigate to={"/"} />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: "/users/sign-in",
    element: (
      <ProtectedRoutes>
        <Form isLoginForm={true} />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/users/sign-up",
    element: (
      <ProtectedRoutes>
        <Form isLoginForm={false} />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoutes auth={true}>
        <WhatsAppDashboard />
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <Chats />,
      },
      {
        path: "calls",
        element: <Calls />,
      },
      {
        path: "status",
        element: <Status />,
      },
      {
        path: "StarredMessages",
        element: <StarredMessages />,
      },
      {
        path: "ArchivedChats",
        element: <ArchivedChats />,
      },
    ],
  },
]);

export default router;
