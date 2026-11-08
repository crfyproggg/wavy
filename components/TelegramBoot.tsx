"use client";
import { useEffect } from "react";
/** Inside Telegram: expand the WebView, sync theme, and exchange initData for a server-verified session. */
export default function TelegramBoot() {
  useEffect(() => {
    const s = document.createElement("script"); s.src = "https://telegram.org/js/telegram-web-app.js";
    s.onload = () => { const w = (window as any).Telegram?.WebApp; if (!w?.initData) return; w.ready(); w.expand(); w.setHeaderColor("#0E0B14"); w.setBackgroundColor("#0E0B14");
      fetch("/api/auth/telegram", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initData: w.initData }) }); };
    document.body.appendChild(s);
  }, []);
  return null;
}
