import { useQuery } from "@tanstack/react-query";
import { getGithubSnapshot } from "@/services/github";
import type { Repository } from "@/types/github";

export function useGithubSnapshot() {
  return useQuery({
    queryKey: ["github-snapshot"],
    queryFn: getGithubSnapshot,
    staleTime: 1000 * 60 * 60, // 1 hour — data itself only refreshes every 6h
  });
}

export function usePinnedRepositories(): {
  data: Repository[] | undefined;
  isLoading: boolean;
  error: unknown;
} {
  const { data, isLoading, error } = useGithubSnapshot();
  const pinned = data?.repositories.filter((r) => r.isPinned);
  return { data: pinned, isLoading, error };
}

export function useRepository(name: string) {
  const { data, isLoading, error } = useGithubSnapshot();
  const repo = data?.repositories.find((r) => r.name === name);
  return { data: repo, isLoading, error };
}
