import React from "react";
import { useAuth } from "../contexts/AuthContext";
import AccountDashboard from "../components/AccountDashboard";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  const { user } = useAuth();

  if (user) {
    return <AccountDashboard />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <p>Please log in to manage your account, track your orders, and add addresses.</p>
      <div className="mt-6 max-w-md mx-auto">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;