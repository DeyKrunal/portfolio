import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db, firebaseEnabled } from "@/lib/firebase";

export function useFirestoreDoc<T>(collectionName: string, docId: string) {
  return useQuery({
    queryKey: ["firestore-doc", collectionName, docId],
    queryFn: async (): Promise<T | null> => {
      if (!db) return null;
      const snap = await getDoc(doc(db, collectionName, docId));
      return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
    },
    enabled: firebaseEnabled,
    staleTime: 1000 * 60 * 5,
  });
}
