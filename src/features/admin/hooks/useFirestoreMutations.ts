import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

function assertDb() {
  if (!db) throw new Error("Firebase is not configured.");
  return db;
}

export function useCreateDoc(collectionName: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const firestore = assertDb();
      return addDoc(collection(firestore, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firestore", collectionName] });
    },
  });
}

export function useUpdateDoc(collectionName: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const firestore = assertDb();
      return updateDoc(doc(firestore, collectionName, id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firestore", collectionName] });
    },
  });
}

export function useDeleteDoc(collectionName: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const firestore = assertDb();
      return deleteDoc(doc(firestore, collectionName, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firestore", collectionName] });
    },
  });
}

/** Batch-updates the `order` field for a reordered list (drag/up-down reorder). */
export function useReorderDocs(collectionName: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: { id: string; order: number }[]) => {
      const firestore = assertDb();
      const batch = writeBatch(firestore);
      items.forEach(({ id, order }) => {
        batch.update(doc(firestore, collectionName, id), { order });
      });
      return batch.commit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firestore", collectionName] });
    },
  });
}

export function useSetSettingsDoc(docId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const firestore = assertDb();
      return updateDoc(doc(firestore, "settings", docId), {
        ...data,
        updatedAt: serverTimestamp(),
      }).catch(async () => {
        // doc may not exist yet on first save
        const { setDoc } = await import("firebase/firestore");
        return setDoc(doc(firestore, "settings", docId), {
          ...data,
          updatedAt: serverTimestamp(),
        });
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firestore-doc", "settings", docId] });
    },
  });
}
