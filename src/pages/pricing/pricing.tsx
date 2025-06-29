import Navbar from "@/components/common/navbar/navbar";
import CardPricing from "@/components/pricing/cardPricing";
import { PackageType } from "@/types/pricing/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Pricing() {
  const [packages, setPackages] = useState<PackageType[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/packages`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error("Get packages failed");
        }

        setPackages(result.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          console.error("Error: ", error.message);
        } else {
          setError("Terjadi kesalahan yang tidak diketahui");
          console.error("Unknown error: ", error);
        }
      }
    };

    fetchPackages();
  }, []);

  const handleClickBasic = () => {
    navigate("/");
  };

  const handleClickPlus = (id: number) => {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      navigate("/authentication/login");
      return;
    }

    navigate(`/pricing/${id}/payment`);
  };

  const handleClickPro = (id: number) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/authentication/login");
      return;
    }

    navigate(`/pricing/${id}/payment`);
  };

  const getClickHandler = (name: string, id: number) => {
    switch (name) {
      case "Basic":
        return handleClickBasic;
      case "Plus":
        return () => handleClickPlus(id);
      case "Pro":
        return () => handleClickPro(id);
      default:
        return () => {};
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : packages === null ? (
        <div className="text-center py-10">Loading...</div>
      ) : packages.length === 0 ? (
        <div className="text-center py-10">Belum ada paket tersedia</div>
      ) : (
        <div className="flex flex-row items-center justify-center py-28 space-x-6">
          {packages.map((pkg) => (
            <CardPricing
              key={pkg.id}
              title={pkg.name}
              description={pkg.description}
              price={pkg.price}
              buttonText={
                pkg.name === "Basic" ? "Start for Free" : "Upgrade Now"
              }
              handleClick={getClickHandler(pkg.name, pkg.id)}
              benefits={pkg.benefits}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Pricing;
