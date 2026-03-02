import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalBlob } from "../backend";
import type { VideoJob, VideoJobInput } from "../backend.d.ts";
import { useActor } from "./useActor";

export function useJobsCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["jobsCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.jobsCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFilterByMode(mode: string) {
  const { actor, isFetching } = useActor();
  return useQuery<VideoJob[]>({
    queryKey: ["jobs", "mode", mode],
    queryFn: async () => {
      if (!actor) return [];
      return actor.filterByMode(mode);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllJobs() {
  const { actor, isFetching } = useActor();
  return useQuery<VideoJob[]>({
    queryKey: ["jobs", "all"],
    queryFn: async () => {
      if (!actor) return [];
      const [basic, advanced] = await Promise.all([
        actor.filterByMode("basic"),
        actor.filterByMode("advanced"),
      ]);
      return [...basic, ...advanced];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useImageAsset(id: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<string | null>({
    queryKey: ["imageAsset", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      const blob = await actor.getImageAsset(id);
      if (!blob) return null;
      const bytes = await blob.getBytes();
      const jsBlob = new Blob([bytes], { type: "image/*" });
      return URL.createObjectURL(jsBlob);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useJobComments(jobId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["comments", jobId?.toString()],
    queryFn: async () => {
      if (!actor || jobId === null) return [];
      return actor.getJobComments(jobId);
    },
    enabled: !!actor && !isFetching && jobId !== null,
  });
}

export function useCreateJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: VideoJobInput) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.createJob(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobsCount"] });
    },
  });
}

export function useUploadImageAsset() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      if (!actor) throw new Error("Actor not initialized");
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes);
      return actor.uploadImageAsset(id, blob);
    },
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      jobId,
      comment,
    }: { jobId: bigint; comment: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.addJobComment(jobId, comment);
    },
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", jobId.toString()],
      });
    },
  });
}
