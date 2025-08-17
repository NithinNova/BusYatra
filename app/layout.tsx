import type React from "react"
import type { Metadata } from "next"
import { Libre_Bodoni, Playfair_Display } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import "./globals.css"

const libreBodoni = Libre_Bodoni({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre-bodoni",
  weight: ["400", "500", "600", "700"],
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "BusYatra - Book Your Journey",
  description: "Modern bus booking system for India - Book buses across major Indian cities without any login required",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${libreBodoni.variable} ${playfairDisplay.variable} antialiased`}>
      <body className="font-serif">
        {children}
        <Toaster />
        <Sonner richColors expand closeButton position="top-right" />
      </body>
    </html>
  )
}
