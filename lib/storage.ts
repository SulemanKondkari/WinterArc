import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";
import crypto from 'crypto';

const BUCKET_NAME = "winter-arc-proofs";

// Use Neon Object Storage (S3 compatible)
const files = new Files({ adapter: neon({ bucket: BUCKET_NAME }) });

export async function uploadMedia(file: Buffer, mimeType: string, prefix = "proof"): Promise<{ key: string, url: string, size: number }> {
  const extension = mimeType.split('/')[1] || 'jpg';
  const filename = `${prefix}-${crypto.randomBytes(8).toString('hex')}.${extension}`;
  
  await files.upload(filename, file, { contentType: mimeType });

  // Get the public URL for the file (because our bucket is public_read)
  // Neon injects AWS_ENDPOINT_URL_S3 into the environment
  const endpoint = process.env.AWS_ENDPOINT_URL_S3 || '';
  const publicUrl = `${endpoint}/${BUCKET_NAME}/${filename}`;

  return {
    key: publicUrl, // Store the full URL as the storageKey in DB for simplicity
    url: publicUrl,
    size: file.length,
  };
}
