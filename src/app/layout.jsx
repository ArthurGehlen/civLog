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
  icons: {
    icon: [
      {
        url: "https://assets.2k.com/1a6ngf98576c/45leB4MJBeu2NfO209Mnix/b6c0f51d30bb73d22e4f2c528323defb/Civ_Franchise_Favicon_Black.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "https://assets.2k.com/1a6ngf98576c/7hZpAUoMJrJFJE1Kjjab6G/0ed1acffaa545e5e95a5eb332c8a3789/Civ_Franchise_Favicon_White.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body suppressHydrationWarning>
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
