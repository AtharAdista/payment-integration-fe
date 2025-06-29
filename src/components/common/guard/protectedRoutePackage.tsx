// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  allowedPackages: string[]; // contoh: ['plus', 'pro']
  children: React.ReactNode;
}

const ProtectedRoutePackage = ({ allowedPackages, children }: ProtectedRouteProps) => {
  const [packageName, setPackageName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/package/active`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log(data.package)
        if (res.ok) {
          setPackageName(data.package?.toLowerCase());
        } else {
          setPackageName(null);
        }
      } catch (err) {
        console.error("Failed to fetch user package:", err);
        setPackageName(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPackage();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!packageName || !allowedPackages.includes(packageName)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoutePackage;
