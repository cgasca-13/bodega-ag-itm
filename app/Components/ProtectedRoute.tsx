"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    
    if (!token) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; // O puedes mostrar un loader
  }

  return <>{children}</>;
};

export default ProtectedRoute;
