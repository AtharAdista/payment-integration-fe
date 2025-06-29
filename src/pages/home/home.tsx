import Navbar from "@/components/common/navbar/navbar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

function Home() {
  const [activePackageName, setActivePackageName] = useState<string | null>(
    null
  );
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchActivePackage = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/package/active`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (response.ok && result.package) {
          setActivePackageName(result.package); 
        }
      } catch (error) {
        console.error("Failed to fetch package info", error);
      }
    };

    fetchActivePackage();
  }, [token]);

  const isFree = activePackageName === "free";
  const isPro = activePackageName === "Pro";
  const isPlus = activePackageName === "Plus";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-28 space-y-14">
        <div className="font-semibold text-2xl">
          Selamat datang di page untuk paket Free
        </div>

        {isFree || !activePackageName && (
          <Button asChild>
            <a href="/pricing" className="text-lg cursor-pointer">
              Pricing
            </a>
          </Button>
        )}

        {isPro && (
          <div className="flex gap-4">
            <Button asChild>
              <a href="/pro">Pro</a>
            </Button>
            <Button asChild>
              <a href="/plus">Plus</a>
            </Button>
          </div>
        )}

        {isPlus && (
          <Button asChild>
            <a href="/plus">Plus</a>
          </Button>
        )}
      </div>
    </div>
  );
}

export default Home;
