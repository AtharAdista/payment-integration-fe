import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePackage, setActivePackage] = useState<string>("free");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    const fetchActivePackage = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/package/active`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data?.package) {
          setActivePackage(data.package.toLowerCase());
        }
      } catch (err) {
        console.error("Failed to fetch active package:", err);
      }
    };

    if (token) {
      fetchActivePackage();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setActivePackage("free");
    navigate("/");
  };

  return (
    <div className="flex flex-row justify-between h-18 bg-white shadow-xl text-black items-center px-6">
      <div className="flex flex-row items-center space-x-16">
        <a className="font-bold text-2xl" href="/">
          PayForPage
        </a>

        {/* Menu navigasi berdasarkan paket */}
        {!isLoggedIn || activePackage === "free" ? (
          <a href="/pricing" className="cursor-pointer">
            Pricing
          </a>
        ) : (
          <div className="flex space-x-4">
            <a href="/" className="cursor-pointer">
              Free Page
            </a>
            {(activePackage === "plus" || activePackage === "pro") && (
              <a href="/plus" className="cursor-pointer">
                Plus Page
              </a>
            )}
            {activePackage === "pro" && (
              <a href="/pro" className="cursor-pointer">
                Pro Page
              </a>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-row space-x-4 items-center">
        {!isLoggedIn ? (
          <>
            <a
              href="/authentication/login"
              className="border py-1 px-3 hover:bg-gray-100 hover:shadow-2xl border-black"
            >
              Sign In
            </a>
            <a
              href="/authentication/register"
              className="border py-1 px-3 bg-black opacity-80 text-white hover:opacity-100"
            >
              Sign Up
            </a>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="border py-1 px-3 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
