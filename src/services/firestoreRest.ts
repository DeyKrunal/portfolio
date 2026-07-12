/**
 * Fetches a single Firestore document via the plain REST API instead of
 * the Firebase SDK. Only usable for documents your firestore.rules allow
 * to be read with `allow read: if true` (e.g. settings/*) — there's no
 * auth token attached here, intentionally.
 *
 * Why this exists instead of just using firebase/firestore: components
 * that are part of the always-mounted layout (like Footer) would pull
 * the ~600KB firebase-vendor chunk into every single page's load if they
 * imported the SDK. A plain fetch() costs nothing extra in the bundle.
 * Route-specific pages that already need real-time listeners, writes, or
 * complex queries should keep using the SDK (see hooks/useFirestoreDoc.ts)
 * -- this is only for cheap, public, read-only reads from shared layout.
 */

interface FirestoreRestValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
}

interface FirestoreRestDocument {
  fields?: Record<string, FirestoreRestValue>;
}

function unwrapFields(fields: Record<string, FirestoreRestValue> | undefined) {
  if (!fields) return {};
  const result: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value.stringValue !== undefined) result[key] = value.stringValue;
    else if (value.integerValue !== undefined) result[key] = Number(value.integerValue);
    else if (value.doubleValue !== undefined) result[key] = value.doubleValue;
    else if (value.booleanValue !== undefined) result[key] = value.booleanValue;
    else result[key] = null;
  }
  return result;
}

export async function fetchPublicFirestoreDoc<T extends Record<string, unknown>>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}/${docId}`;

  try {
    const res = await fetch(url);
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const doc: FirestoreRestDocument = await res.json();
    return unwrapFields(doc.fields) as T;
  } catch {
    return null;
  }
}
