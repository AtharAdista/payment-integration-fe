import { QRCodeCanvas } from "qrcode.react";

type QRCodeProps = {
  value: string;
};

const QRDisplay: React.FC<QRCodeProps> = ({ value }) => {
  return (
    <div className="">
      <h2 className="text-xl font-bold mb-2">Scan QR Code</h2>
      <div className="border-white border-2 p-2">
        <QRCodeCanvas value={value} size={200} />
      </div>
    </div>
  );
};

export default QRDisplay;
