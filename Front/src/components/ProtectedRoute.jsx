import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  // Show a loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <ClipLoader color="#1976d2" size={50} />
      </div>
    );
  }

  // Redirect to login page if user is not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Render the protected component if user is authenticated
  return <Outlet />;
};

export default ProtectedRoute;
