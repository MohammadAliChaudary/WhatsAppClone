import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Form from "./pages/form";
import "./App.css";
function App() {
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
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoutes auth={true}>
            <Dashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/users/sign-in"
        element={
          <ProtectedRoutes>
            <Form isLoginForm={true} />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/users/sign-up"
        element={
          <ProtectedRoutes>
            <Form isLoginForm={false} />
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
}

export default App;
