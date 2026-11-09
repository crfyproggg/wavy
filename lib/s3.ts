import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
/** Works with any S3-compatible storage (Cloudflare R2, Backblaze B2, AWS S3, MinIO). See README for setup. */
export const s3Ready = () => !!(process.env.S3_ENDPOINT && process.env.S3_BUCKET && process.env.S3_KEY && process.env.S3_SECRET && process.env.S3_PUBLIC_URL);
export const publicBase = () => process.env.S3_PUBLIC_URL!.replace(/\/$/, "");
const client = () => new S3Client({ region: process.env.S3_REGION || "auto", endpoint: process.env.S3_ENDPOINT, forcePathStyle: true,
  requestChecksumCalculation: "WHEN_REQUIRED", credentials: { accessKeyId: process.env.S3_KEY!, secretAccessKey: process.env.S3_SECRET! } });
/** Short-lived upload URL. ContentLength is signed, so the browser cannot send a bigger file than declared. */
export const presign = (key: string, contentType: string, size: number) =>
  getSignedUrl(client(), new PutObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key, ContentType: contentType, ContentLength: size }), { expiresIn: 300 });
