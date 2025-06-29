// src/components/NoActiveSubscriptionRoute.tsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

const NoActiveSubscriptionRoute = ({ children }: Props) => {
  const [hasActiveSub, setHasActiveSub] = useState<boolean | null>(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/subscription/active`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        // response should return { active: true } or { active: false }
        setHasActiveSub(data.active);
      } catch (err) {
        console.error("Error checking subscription:", err);
        setHasActiveSub(false);
      }
    };

    if (token) {
      checkSubscription();
    } else {
      setHasActiveSub(false); // assume not active if not logged in
    }
  }, []);

  if (hasActiveSub === null) return <div>Loading...</div>;

  if (hasActiveSub) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default NoActiveSubscriptionRoute;
