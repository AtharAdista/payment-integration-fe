import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PaymentWaiting() {
  const { xenditId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("PENDING");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!xenditId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/payment/status/${xenditId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();

        if (response.ok && result.status) {
          setStatus(result.status);

          if (result.status === "SUCCEEDED") {
            clearInterval(interval);
            setTimeout(() => {
              navigate("/");
            }, 2000);
          }

          if (["EXPIRED", "FAILED"].includes(result.status)) {
            clearInterval(interval); // stop polling if payment failed/expired
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [xenditId, navigate, token]);

  const renderMessage = () => {
    switch (status) {
      case "SUCCEEDED":
        return (
          <>
            <h2 className="text-xl font-semibold text-green-600 mb-4">
              Pembayaran Berhasil!
            </h2>
            <p className="text-gray-500">Mengarahkan ke halaman utama...</p>
          </>
        );
      case "EXPIRED":
        return (
          <>
            <h2 className="text-xl font-semibold text-yellow-600 mb-4">
              Pembayaran Kadaluwarsa
            </h2>
            <p className="text-gray-500">Silakan coba lagi dari awal.</p>
          </>
        );
      case "FAILED":
        return (
          <>
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Pembayaran Gagal
            </h2>
            <p className="text-gray-500">Silakan ulangi proses pembayaran.</p>
          </>
        );
      default:
        return (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Mohon tunggu sebentar...
            </h2>
            <p className="text-gray-500">
              Kami sedang memeriksa status pembayaran Anda.
            </p>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">{renderMessage()}</div>
    </div>
  );
}

export default PaymentWaiting;
