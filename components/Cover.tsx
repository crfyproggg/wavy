/** Square cover. Without an image, a muted gradient is generated from the title. */
export const hueOf = (s: string) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
export default function Cover({ title, url, className = "" }: { title: string; url?: string | null; className?: string }) {
  if (url) return <img src={url} alt="" className={`rounded-md object-cover ${className}`} />;
  const h = hueOf(title);
  return <div aria-hidden className={`rounded-md ${className}`} style={{ background: `linear-gradient(135deg, hsl(${h} 28% 38%), hsl(${(h + 40) % 360} 32% 13%))` }} />;
}
