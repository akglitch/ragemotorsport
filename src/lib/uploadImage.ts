/**
 * Image upload seam — posts the file to our signed Cloudinary route.
 *
 * The browser never sees the Cloudinary secret: the file goes to /api/upload,
 * which checks the Supabase session and uploads server-side, returning the
 * hosted secure_url. That URL drops straight into Car.image / Car.images[] and
 * renders in <next/image> (res.cloudinary.com is whitelisted in next.config).
 */

/** Client-side size guard (the server enforces its own ceiling too). */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

export class ImageUploadError extends Error {}

export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new ImageUploadError('Only image files are allowed.');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new ImageUploadError('Image is larger than 10 MB.');
  }

  const form = new FormData();
  form.append('file', file);

  let res: Response;
  try {
    res = await fetch('/api/upload', { method: 'POST', body: form });
  } catch {
    throw new ImageUploadError('Network error during upload.');
  }

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: 'Upload failed.' }));
    throw new ImageUploadError(error || 'Upload failed.');
  }

  const { url } = await res.json();
  if (!url) throw new ImageUploadError('Upload returned no URL.');
  return url as string;
}
