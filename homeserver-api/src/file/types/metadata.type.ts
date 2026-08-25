export interface Metadata {
  name: string;
  storageName: string;
  mimeType: string;
  size: bigint | number;
  uploadedAt: Date;
  buffer: Buffer;
  checksum: string;
}

export type UploadFileFlag = {
  flag: boolean;
  name: string;
};
