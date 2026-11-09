import Link from "next/link"; import { currentUser } from "@/lib/auth"; import { s3Ready } from "@/lib/s3"; import UploadForm from "@/components/UploadForm";
export const dynamic = "force-dynamic";
export default async function Upload() {
  const u = await currentUser();
  return (<main className="mx-auto max-w-xl px-4 py-8"><h1 className="mb-6 text-3xl font-extrabold tracking-tight">Upload a track</h1>
    {!u ? <><p className="mb-4 text-mute">Sign in to publish your music.</p><Link href="/login" className="rounded bg-[#ECE9E4] px-5 py-2 font-semibold text-ink">Sign in</Link></>
      : !s3Ready() ? <p className="rounded-md border border-line p-4 text-sm text-mute">File storage is not connected yet. The site owner needs to add the S3 variables described in the README.</p>
      : <UploadForm />}</main>);
}
