import { Inter } from "next/font/google";
import "./globals.css";
import Mainstatetool from "@/components/Mainstate(tool)/Mainstatetool";

const InterFont = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Customize Your Product",
  description:
    "Design your own custom T-shirts. Use our easy-to-use customization tool to add your personal touch and bring your creativity to life.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${InterFont.className}  antialiased`}>
        <Mainstatetool>{children}</Mainstatetool>
      </body>
    </html>
  );
}
