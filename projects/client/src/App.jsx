import { Box, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { axiosInstance } from "./api";
import GuestRoute from "./components/GuesRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard1 from "./pages/admin/Dashboard1";
import Dashboard2 from "./pages/admin/Dashboard2";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/Profile";
import RegisterPage from "./pages/Register";
import NotFoundPage from "./pages/404";
import Loading from "./components/Loading";
import { login } from "./redux/features/authSlice";
import MyPorfile from "./pages/MyPorfile";
import Navbar from "./components/Navbar";

const App = () => {
  const [authCheck, setAuthCheck] = useState(false);
  const authSelector = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const keepUserLogin = async () => {
    try {
      const auth_token = localStorage.getItem("auth_token");

      if (!auth_token) {
        setAuthCheck(true);
        return;
      }

      const response = await axiosInstance.get(`/auth/refresh-token`, {
        headers: {
          authorization: `Bearer ${auth_token}`,
        },
      });

      dispatch(login(response.data.data));
      localStorage.setItem("auth_token", response.data.token);
      setAuthCheck(true);
    } catch (error) {
      console.log(error);
      setAuthCheck(true);
    }
  };

  const renderAdminRoutes = () => {
    if (authSelector.role === "admin") {
      return (
        <>
          <Route path="/admin/dashboard1" element={<Dashboard1 />} />
          <Route path="/admin/dashboard2" element={<Dashboard2 />} />
        </>
      );
    }
  };

  useEffect(() => {
    keepUserLogin();
  }, []);

  if (!authCheck) {
    return (
      <Box alignContent={"center"}>
        <Spinner
          thickness="4px"
          speed="0.35s"
          emptyColor="gray.200"
          color="teal"
          size="xl"
        />
      </Box>
    );
  }

  return (
    <Box backgroundColor={"#fafafa"}>
      <Navbar />
      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile/:username/:id" element={<ProfilePage />} />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyPorfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        {renderAdminRoutes()}
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/testPage" element={<Loading />} />
      </Routes>
    </Box>
  );
};
export default App;
