export interface fileClipboardObj {
 _id: string | number;
 name?: string;
 src?: string;
 type: string;
 blob: string | Blob;
 sizes?: number | string;
}
