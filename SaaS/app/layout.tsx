import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AegisScan | Authorized AI security testing",
  description: "Safe, authorized AI application security testing."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
