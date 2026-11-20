import type { Metadata } from "next";
import { Fraunces, Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import { CartProvider } from '@/lib/cart-context'
import "./globals.css";

const fraunces = Fraunces({ 
  subsets: ['latin'], 
  variable: '--font-display',
  weight: ['400', '600']
})
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-body' 
})

export const metadata: Metadata = {
  title: "Kedai Kopi",
  description: "Kopi untuk jam-jam yang berarti — diracik setiap hari dari biji pilihan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${fraunces.variable} ${inter.variable} font-sans`}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}