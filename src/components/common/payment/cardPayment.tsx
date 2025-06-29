// import React, { useEffect } from "react";

// declare global {
//   interface Window {
//     Xendit: any;
//   }
// }

// const loadXenditScript = () => {
//   return new Promise<void>((resolve, reject) => {
//     const script = document.createElement("script");
//     script.src = "https://js.xendit.co/v1/xendit.min.js";
//     script.async = true;
//     script.onload = () => resolve();
//     script.onerror = () => reject();
//     document.body.appendChild(script);
//   });
// };

// const CardPayment: React.FC = () => {
//   useEffect(() => {
//     loadXenditScript()
//       .then(() => {
//         if (window.Xendit) {
//           window.Xendit.setPublishableKey(
//             "xnd_public_development_LYgNhlG34jqDZ1fPfy49xLMhHaLZcpoclVxrf82nn4Q2Bzy2B_HAZ__kU65"
//           );
//         }
//       })
//       .catch(() => {
//         console.error("Gagal memuat Xendit.js");
//       });
//   }, []);

//   const handleTokenize = () => {
//     if (!window.Xendit) {
//       console.error("Xendit.js belum siap");
//       return;
//     }
//     window.Xendit.card.createToken(
//       {
//         card_number: "4111111111111111",
//         card_exp_month: "12",
//         card_exp_year: "2025",
//         card_cvn: "123",
//         amount: 10000,
//         card_holder_first_name: "Athar",
//         card_holder_last_name: "Adista",
//         card_holder_email: "AtharAdista@gmail.com",
//         card_holder_phone_number: "+6281268980012",
//       },
//       (err: any, token: any) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         console.log("Token berhasil dibuat:", token);
//         // Kirim token ke backend untuk proses pembayaran
//       }
//     );
//   };

//   return <button onClick={handleTokenize}>Bayar dengan Kartu</button>;
// };

// export default CardPayment;
