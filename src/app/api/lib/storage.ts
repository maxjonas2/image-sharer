import {
  FullMetadata,
  getBytes,
  getDownloadURL,
  getStorage,
  list,
  ref,
  uploadBytes,
} from "firebase/storage";
import { ImageRecord } from "../upload/route";
import { app } from "./firebase";

const storage = getStorage(app);

export async function uploadFilesToBucket(
  records: ImageRecord[],
  bucketId: string
): Promise<FullMetadata[]> {
  const metadata: FullMetadata[] = [];

  for (const record of records) {
    const imageRef = ref(
      storage,
      `${bucketId || "uploaded_images"}/` +
        record.id +
        "." +
        record.file.name.split(".")[1]
    );
    const uploadResult = await uploadBytes(imageRef, record.file.content);
    console.log("Uploaded " + uploadResult.metadata.fullPath);
    metadata.push(uploadResult.metadata);
  }

  return metadata;
}

export async function getFileList(bucketId: string) {
  const itemList = await list(ref(storage, bucketId.toString()));
  return itemList.items;
}

export async function getFilesFromBucket(
  bucketId: string
): Promise<ArrayBuffer[]> {
  const data: ArrayBuffer[] = [];
  const fileList = await getFileList(bucketId);
  for (const file of fileList) {
    data.push(await getBytes(file));
  }
  return data;
}

export async function getDownloadLinks(bucketId: string) {
  const fileList = await getFileList(bucketId);
  const downloadLinks: string[] = [];
  for (const file of fileList) {
    downloadLinks.push(await getDownloadURL(file));
  }
  return downloadLinks;
}
