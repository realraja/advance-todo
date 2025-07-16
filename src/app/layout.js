import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/redux/storeProvider";
import ClientOnlyHydrator from "@/components/localStorage/setLocalStorage";
import Header from "@/components/navbar/header";
import Footer from "@/components/navbar/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LifeTrack App",
  description: "Created by rajesh kumar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          <div className="h-[100vh] w-[100vw] overflow-auto scrollEditclass text-white  z-[-2] bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
            <div className="max-sm:pb-20">
            <ClientOnlyHydrator />
            <Toaster toastOptions={{ duration: 4000 }} />
            <Header />
            {children}
            <Footer />
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
