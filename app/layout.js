import Header from "@/components/header";
import "./globals.css";
import { Gowun_Batang } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const gowunBatang = Gowun_Batang({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "RoughNote",
  description: "A journaling app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>

    <html lang="en">
      <body className={`${gowunBatang.className} bg-[#F9F9F7]`}>
        <Header/>
        <main className="min-h-screen bg-[#F9F9F7]">{children}</main>
        <Toaster richColors/>

        <footer className="bg-[color:#1a7431]/20 py-12">
          <div className="mx-auto px-4 text-center text-gray-900">
            <p>Made with ❤ by Aditya Thakur</p>
          </div>
        </footer>
      </body>
    </html>
    </ClerkProvider>
  );
}
