import { FirebaseApp } from "firebase/app";
import {
  FirebaseStorage,
  FullMetadata,
  UploadResult,
  getBytes,
  getDownloadURL,
  getStorage,
  list,
  ref,
  uploadBytes,
} from "firebase/storage";

class ImageUploader implements Uploader {
  protected storage: FirebaseStorage;

  constructor(app: FirebaseApp, bucketName: string) {
    this.storage = getStorage(app, bucketName);
  }

  public static checkImageSize(image: Blob, maxSize: number): boolean {
    return image.size > maxSize;
  }

  async upload(
    file: Blob,
    name: string,
    bucketName: string
  ): Promise<UploadResult> {
    if (ImageUploader.checkImageSize(file, 1024 * 5) === false) {
      throw new Error("File too large");
    }
    const extension = file.type.split("/")[1] ?? "png";
    const imageRef = ref(
      this.storage,
      bucketName + "/" + name + "." + extension
    );
    const uploadResult = await uploadBytes(imageRef, file);
    return uploadResult;
  }
}

interface Uploader {
  upload(file: Blob, name: string, bucketName: string): Promise<UploadResult>;
}
