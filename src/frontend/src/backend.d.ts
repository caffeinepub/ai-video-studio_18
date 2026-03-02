import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface VideoJobInput {
    imageAssetId: string;
    musicTrackId: string;
    mode: string;
    subtitlesEnabled: boolean;
    resolution: string;
    voiceLanguage: string;
    voiceGender: string;
    prompt: string;
}
export interface VideoJob {
    id: bigint;
    imageAssetId: string;
    owner: Principal;
    musicTrackId: string;
    mode: string;
    subtitlesEnabled: boolean;
    resolution: string;
    voiceLanguage: string;
    voiceGender: string;
    prompt: string;
}
export interface backendInterface {
    addJobComment(jobId: bigint, comment: string): Promise<void>;
    createJob(input: VideoJobInput): Promise<bigint>;
    filterByMode(mode: string): Promise<Array<VideoJob>>;
    filterByVoiceGender(gender: string): Promise<Array<VideoJob>>;
    getImageAsset(id: string): Promise<ExternalBlob | null>;
    getJobComments(jobId: bigint): Promise<Array<string>>;
    getMusicAsset(id: string): Promise<ExternalBlob | null>;
    jobsCount(): Promise<bigint>;
    transformLanguage(): Promise<Array<string>>;
    uploadImageAsset(id: string, blob: ExternalBlob): Promise<void>;
    uploadMusicAsset(id: string, blob: ExternalBlob): Promise<void>;
}
