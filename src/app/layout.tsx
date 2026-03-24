import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConvertIt — Universal Converter",
  description: "One tool for all conversions: units, colors, numbers, timezones, currencies, encoding, and hashing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
