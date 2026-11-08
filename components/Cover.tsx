/** Round "record" cover. Without an image, a unique colour record is generated from the title. */
export const hueOf = (s: string) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
export default function Cover({ title, url, className = "" }: { title: string; url?: string | null; className?: string }) {
  if (url) return <img src={url} alt="" className={`rounded-full object-cover ${className}`} />;
  const h = hueOf(title);
  return (
    <div aria-hidden className={`grid place-items-center overflow-hidden rounded-full ${className}`}
      style={{ background: `conic-gradient(from ${h}deg, hsl(${h} 85% 58%), hsl(${(h + 50) % 360} 95% 62%), hsl(${(h + 290) % 360} 70% 32%), hsl(${h} 85% 58%))` }}>
      <div className="h-[26%] w-[26%] rounded-full bg-ink ring-2 ring-white/20" />
    </div>
  );
}
