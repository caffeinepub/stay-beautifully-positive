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
export interface InspirationalMessage {
    text: string;
    author: string;
    category: string;
}
export interface backendInterface {
    getAllMessages(): Promise<Array<InspirationalMessage>>;
    getAppMotto(): Promise<string>;
    getDailyMessage(): Promise<InspirationalMessage>;
    getMessageByCategory(category: string): Promise<Array<InspirationalMessage>>;
    uploadBackgroundMusic(metadata: ExternalBlob): Promise<void>;
}
