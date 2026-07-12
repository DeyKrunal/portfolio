import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB, matches storage.rules
const MAX_PDF_BYTES = 20 * 1024 * 1024; // 20MB, matches storage.rules

export function useStorageUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File, pathPrefix = "public"): Promise<string> {
    if (!storage) throw new Error("Firebase Storage is not configured.");

    const isPdf = file.type === "application/pdf";
    const maxBytes = isPdf ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      const msg = `File exceeds the ${Math.round(maxBytes / 1024 / 1024)}MB limit.`;
      setError(msg);
      throw new Error(msg);
    }
    if (!isPdf && !file.type.startsWith("image/")) {
      const msg = "Only images or PDFs are accepted here.";
      setError(msg);
      throw new Error(msg);
    }

    setError(null);
    setProgress(0);

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const storageRef = ref(storage, `${pathPrefix}/${safeName}`);
    const task = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      task.on(
        "state_changed",
        (snap) => {
          setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        },
        (err) => {
          setError(err.message);
          setProgress(null);
          reject(err);
        },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          setProgress(null);
          resolve(url);
        }
      );
    });
  }

  return { upload, progress, error };
}
