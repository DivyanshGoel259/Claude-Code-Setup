import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/providers/ThemeProvider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vanna Finance | Composable Credit for DeFi",
  description:
    "Borrow 10x. Trade Anywhere. Unlock composable credit across 15+ DeFi protocols with professional-grade risk management.",
  keywords: [
    "DeFi",
    "composable credit",
    "undercollateralized lending",
    "leverage",
    "Greeks dashboard",
    "margin trading",
    "Vanna Finance",
  ],
  openGraph: {
    title: "Vanna Finance | Borrow 10x. Trade Anywhere.",
    description:
      "Composable credit infrastructure for DeFi. Deploy leverage across perps, options, spot, and yield farming.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vanna Finance | Composable Credit for DeFi",
    description: "Borrow 10x. Trade Anywhere. Professional-grade DeFi.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('vanna-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
