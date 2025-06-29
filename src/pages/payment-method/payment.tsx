import Navbar from "@/components/common/navbar/navbar";
import { Button } from "@/components/ui/button";
import { qrChannels, vaChannels } from "@/static/payment";
import { PackageType } from "@/types/pricing/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Payment() {
  const [packageChoose, setPackageChoose] = useState<PackageType | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
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

    fetchPackage();
  }, [id, token]);

  const handleQRChannelClick = async (channelCode: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            package_id: Number(id),
            payment: {
              amount: packageChoose?.price,
              description: packageChoose?.description,
              payment_method: {
                type: "QR_CODE",
                reusability: "ONE_TIME_USE",
                qr_code: {
                  channel_code: channelCode,
                },
              },
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal membuat pembayaran");
      }

      const result = await response.json();
      navigate(`/pricing/${id}/payment/${result.id}?type=QR`, {
        state: result,
      });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handleVaChannelClick = async (channelCode: string) => {
    try {

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            package_id: Number(id),
            payment: {
              amount: packageChoose?.price,
              description: packageChoose?.description,
              payment_method: {
                type: "VIRTUAL_ACCOUNT",
                reusability: "ONE_TIME_USE",
                virtual_account: {
                  channel_code: channelCode,
                },
              },
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal membuat pembayaran");
      }

      const result = await response.json();
      navigate(`/pricing/${id}/payment/${result.id}?type=VA`, {
        state: result,
      });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handleCardChannelClick = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            package_id: Number(id),
            payment: {
              amount: packageChoose?.price,
              description: packageChoose?.description,
              payment_method: {
                type: "CARD",
              },
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal membuat pembayaran");
      }

      const result = await response.json();

      fetchPaymentInformation(result.id)
      console.log(result);
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const fetchPaymentInformation = async (xenditId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/data/${xenditId}?type=CARD`,
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

      window.location = result.invoice_url
    } catch (error) {
      console.error("Payment Info Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col py-10 px-2 items-center">
        <div className="w-[80%] flex flex-col">
          <p className="text-black mb-4">Pilih Metode pembayaran</p>
          <div className="flex flex-col space-y-12">
            <div className="flex flex-col space-y-4 p-10 bg-gradient-to-b from-gray-800 to-gray-900 backdrop-blur-lg text-white shadow-lg rounded-lg">
              <p>Transfer Bank via Virtual Account</p>
              <div className="flex flex-row space-x-4 text-center">
                {vaChannels.map((channel) => (
                  <Button
                    key={channel.channel_code}
                    className="border py-2 px-4 w-26 bg-white text-black hover:bg-gray-300"
                    onClick={() => handleVaChannelClick(channel.channel_code)}
                  >
                    {channel.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-4 p-10 bg-gradient-to-b from-gray-800 to-gray-900 backdrop-blur-lg text-white shadow-lg rounded-lg">
              <p>QR CODE</p>
              <div className="flex flex-row space-x-4 text-center">
                {qrChannels.map((channel) => (
                  <Button
                    key={channel.channel_code}
                    onClick={() => handleQRChannelClick(channel.channel_code)}
                    className="border py-2 px-4 w-26 bg-white text-black hover:bg-gray-300"
                  >
                    {channel.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-4 p-10 bg-gradient-to-b from-gray-800 to-gray-900 backdrop-blur-lg text-white shadow-lg rounded-lg">
              <p>Debit/Kredit</p>
              <div className="flex flex-row space-x-4 text-center">
                <Button
                  onClick={() => handleCardChannelClick()}
                  className="border py-2 px-4 w-26 bg-white text-black hover:bg-gray-300"
                >
                  Card
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
