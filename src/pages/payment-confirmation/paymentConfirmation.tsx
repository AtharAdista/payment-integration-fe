import Navbar from "@/components/common/navbar/navbar";
import QRDisplay from "@/components/common/qr-code/qrDisplay";
import { Button } from "@/components/ui/button";
import { PackageType } from "@/types/pricing/types";
import { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PaymentConfirmation() {
  const [packageChoose, setPackageChoose] = useState<PackageType | null>(null);
  const [copied, setCopied] = useState(false);

  const [paymentInfo, setPaymentInfo] = useState<{
    payment_id: string;
    type: string;
    customer_name?: string;
    virtual_account_number?: string;
    qr_string?: string;
  } | null>(null);

  console.log(paymentInfo);

  const navigate = useNavigate();
  const { id, xenditId } = useParams();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/package/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error("Get packages failed");
        }

        setPackageChoose(result.data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error: ", error.message);
        } else {
          console.error("Unknown error: ", error);
        }
      }
    };

    const fetchPaymentInformation = async () => {
      if (!xenditId) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/payment/data/${xenditId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Failed to fetch payment information"
          );
        }

        setPaymentInfo(result);
      } catch (error) {
        console.error("Payment Info Error:", error);
      }
    };

    fetchPackage();
    fetchPaymentInformation();
  }, [id, token, xenditId]);

  const fetchSimulationPayment = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/simulate/${
          paymentInfo?.payment_id
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            amount: packageChoose?.price,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Simulasi pembayaran gagal");
      }

      toast.success("Simulasi pembayaran berhasil!");
    } catch (error) {
      toast.error("Gagal melakukan simulasi pembayaran.");
      console.error("Simulation error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <div className="flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Pembayaran
          </h2>

          <div className="p-8 bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl rounded-2xl space-y-6">
            <h3 className="text-xl font-semibold">
              Pembayaran untuk Paket{" "}
              <span className="text-yellow-400">{packageChoose?.name}</span>
            </h3>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">
              <div className="space-y-3">
                <p className="text-3xl font-bold text-green-400">
                  Rp{packageChoose?.price}
                </p>
                <p className="text-sm text-gray-300">
                  Pembayaran ini hanya berlaku selama{" "}
                  <span className="font-medium">1 jam</span>.
                </p>
                <p className="text-sm text-gray-300">
                  Tekan tombol di bawah untuk konfirmasi bahwa pembayaran telah
                  dilakukan.
                </p>
                <div className="flex flex-col">
                  <Button
                    variant="outline"
                    className="mt-4 text-black hover:bg-gray-300"
                    onClick={() =>
                      navigate(`/pricing/${id}/payment/${xenditId}/status`)
                    }
                  >
                    Saya Sudah Membayar
                  </Button>
                  <Button
                    variant="outline"
                    className="mt-4 text-black hover:bg-gray-300"
                    onClick={fetchSimulationPayment}
                  >
                    Tekan tombol ini untuk simulasi sudah membayar
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                {paymentInfo?.type == "QR_CODE" ? (
                  <QRDisplay value={paymentInfo.qr_string || ""} />
                ) : (
                  <div className="bg-white text-gray-800 px-6 py-4 rounded-xl shadow-lg text-center relative w-fit">
                    <p className="text-sm font-semibold mb-2">
                      Virtual Account Number
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <p className="text-xl font-mono font-bold tracking-widest">
                        {paymentInfo?.virtual_account_number}
                      </p>
                      <span
                        onClick={() => {
                          navigator.clipboard.writeText(
                            paymentInfo?.virtual_account_number || ""
                          );
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="cursor-pointer hover:text-blue-600 transition"
                        title="Salin Nomor"
                      >
                        <FiCopy size={20} />
                      </span>
                    </div>

                    {copied && (
                      <p className="text-xs text-green-600 mt-2 animate-pulse">
                        Nomor berhasil disalin!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentConfirmation;
