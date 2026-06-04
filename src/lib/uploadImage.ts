/**
 * Image upload seam.
 *
 * Today this reads the selected file into a base-64 data URL on the client, so
 * the admin previews and persists images with no backend. It returns a string
 * that drops straight into `Car.image` / `Car.images[]` and renders in
 * <next/image>.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * TODO(cloudinary): replace the body with an unsigned upload. Nothing else in
 * the app calls Cloudinary — only this function — so this is the single swap:
 *
 *   const form = new FormData()
 *   form.append('file', file)
 *   form.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
 *   const res = await fetch(
 *     `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
 *     { method: 'POST', body: form },
 *   )
 *   const data = await res.json()
 *   return data.secure_url as string
 * ───────────────────────────────────────────────────────────────────────────
 */

/** Max accepted file size (bytes). Keeps localStorage data URLs sane pre-Cloudinary. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export class ImageUploadError extends Error {}

export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new ImageUploadError('Only image files are allowed.');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new ImageUploadError('Image is larger than 5 MB.');
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new ImageUploadError('Could not read the file.'));
    reader.readAsDataURL(file);
  });
}
