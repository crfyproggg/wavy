import "./globals.css"; import { Inter } from "next/font/google";
import { PlayerProvider } from "@/components/Player"; import TelegramBoot from "@/components/TelegramBoot"; import TopNav from "@/components/TopNav"; import BottomNav from "@/components/BottomNav";
const font = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });
export const metadata = { title: "WAVY" };
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#121212" };
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className={`${font.className} bg-ink text-[#F2F2F2]`} style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 150px)" }}>
    <PlayerProvider><TelegramBoot /><TopNav />{children}<BottomNav /></PlayerProvider></body></html>);
}
