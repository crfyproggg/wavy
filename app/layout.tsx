import "./globals.css"; import { PlayerProvider } from "@/components/Player"; import TelegramBoot from "@/components/TelegramBoot";
export const metadata = { title: "WAVY" };
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className="bg-ink text-white pb-28"><PlayerProvider><TelegramBoot />{children}</PlayerProvider></body></html>);
}
