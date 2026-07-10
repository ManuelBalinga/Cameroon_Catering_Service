import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/context/I18nContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cameroon Catering Service — Book trusted caterers for every event",
  description:
    "Discover, compare and book verified caterers across Cameroon. Request quotes, pay deposits with MTN MoMo & Orange Money, and review after your event.",
  keywords: [
    "catering Cameroon",
    "traiteur Cameroun",
    "wedding catering Douala",
    "event food Yaoundé",
    "MTN MoMo",
    "Orange Money",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
