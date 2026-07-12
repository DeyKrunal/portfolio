import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query, type QueryConstraint } from "firebase/firestore";
import { db, firebaseEnabled } from "@/lib/firebase";

/**
 * Reads a Firestore collection managed from the Admin Dashboard
 * (certificates, achievements, experience, education, gallery,
 * testimonials, blog posts). Public pages only ever read; all writes
 * happen through the authenticated Admin Dashboard, gated by
 * firestore.rules.
 */
export function useFirestoreCollection<T>(
  collectionName: string,
  orderByField = "order"
) {
  return useQuery({
    queryKey: ["firestore", collectionName],
    queryFn: async (): Promise<T[]> => {
      if (!db) return [];
      const constraints: QueryConstraint[] = [orderBy(orderByField, "asc")];
      const snap = await getDocs(query(collection(db, collectionName), ...constraints));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
    },
    enabled: firebaseEnabled,
    staleTime: 1000 * 60 * 5,
  });
}
