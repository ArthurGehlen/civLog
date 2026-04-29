// Utils
import "@/_lib/fontawesome";
import "./globals.css";
import { Poppins } from "next/font/google";

// Components
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "CivLog",
  description: "Site criado para registrar partidas de civlization 6.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1C1C20",
              border: "0.5px solid #2A2A2E",
              color: "#E8E8E8",
            },
            classNames: {
              success: "toast_success",
              error: "toast_error",
            },
          }}
        />
      </body>
    </html>
  );
}
