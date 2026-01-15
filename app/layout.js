import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Katalog Perpustakaan",
  description: "Daftar buku dari Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        /* TAMBAHKAN BARIS DI BAWAH INI */
        suppressHydrationWarning={true} 
      >
        {children}
      </body>
    </html>
  );
}