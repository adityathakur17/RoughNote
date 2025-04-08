import Header from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RoughNote",
  description: "A journaling app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>

    <html lang="en">
      <body className={`${inter.className}`}>
        <div className="inset-0 bg-[url('/bg.jpg')] opacity-50 fixed -z-10" />
        <Header/>
        <main className="min-h-screen">{children}</main>

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
