import "./globals.css"; import { Bricolage_Grotesque } from "next/font/google";
import { PlayerProvider } from "@/components/Player"; import TelegramBoot from "@/components/TelegramBoot";
const font = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], display: "swap" });
export const metadata = { title: "WAVY" };
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0E0B14" };
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className={`${font.className} bg-ink text-[#F4F1FA]`} style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 96px)" }}><PlayerProvider><TelegramBoot />{children}</PlayerProvider></body></html>);
}
