import { randomUUID } from "crypto";
import {
  FirebaseStorage,
  FullMetadata,
  StorageReference,
  getBytes,
  getDownloadURL,
  getStorage,
  list,
  ref,
  uploadBytes,
} from "firebase/storage";
import { ImageRecord } from "../upload/route";
import { app } from "./firebase";

class FirebaseStorageManager {
  private storage: FirebaseStorage;
  private bucketId: string;

  constructor(bucketId: string) {
    this.storage = getStorage(app);
    this.bucketId = bucketId;
  }

  public async uploadMultipleFiles(
    records: ImageRecord[]
  ): Promise<FullMetadata[]> {
    const metadata: FullMetadata[] = [];
    for (const record of records) {
      const uploadResult = await this.uploadSingleFile(
        record.file.content,
        record.file.name
      );
      metadata.push(uploadResult.metadata);
    }
    return metadata;
  }

  private async uploadSingleFile(
    file: Blob | Uint8Array | ArrayBuffer,
    fileName: string
  ): Promise<{ metadata: FullMetadata }> {
    if (!/\w+\.(jpeg|jpg|png|webm)/.test(fileName)) {
      throw new Error("Invalid file name or extension");
    }
    const ext = fileName.split(".").pop(); // Safe to use pop() due to regex check above.
    const imageId = randomUUID();
    const imageRef = ref(
      this.storage,
      `${this.bucketId || "uploaded_images"}/${imageId}.${ext}`
    );
    const uploadResult = await uploadBytes(imageRef, file);
    return { metadata: uploadResult.metadata };
  }

  public async getFileList(): Promise<StorageReference[]> {
    const itemList = await list(ref(this.storage, this.bucketId));
    return itemList.items;
  }

  public async getFiles(): Promise<ArrayBuffer[]> {
    const data: ArrayBuffer[] = [];
    const fileList = await this.getFileList();
    for (const fileRef of fileList) {
      const fileData = await getBytes(fileRef);
      data.push(fileData);
    }
    return data;
  }

  public async getDownloadLinks(): Promise<string[]> {
    const fileList = await this.getFileList();
    const downloadLinks: string[] = [];
    for (const fileRef of fileList) {
      const url = await getDownloadURL(fileRef);
      downloadLinks.push(url);
    }
    return downloadLinks;
  }

  // public static async uploadImageToNewBucket(fileContent: Blob | Uint8Array | ArrayBuffer, fileName: string): Promise<{ bucketId: string, metadata: FullMetadata[] }> {
  //   const newBucketId = randomUUID();
  //   const manager = new FirebaseStorageManager(newBucketId);
  //   const imageRecord: ImageRecord = {
  //     file: {
  //       name: fileName,
  //       extension : fileName.split('.')[1],
  //       content: fileContent as Uint8Array
  //     }
  //   };
  //   const metadata = await manager.uploadMultipleFiles([imageRecord]);
  //   return { bucketId: newBucketId, metadata };
  // }

  private validateFileName(fileName: string): boolean {
    // Add validation logic here if necessary.
    return /\w+\.(jpeg|jpg|png|webm)/.test(fileName);
  }
}

export { FirebaseStorageManager };
