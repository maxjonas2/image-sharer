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
import { randomUUID } from "crypto";
import { PubSub } from "@google-cloud/pubsub";

const storage = getStorage(app);
const pubSubClient = new PubSub();

function publishMessage(message: string | Buffer): void {
  const data = Buffer.from(message);

  pubSubClient
    .topic("UPLOADED_IMAGES")
    .publishMessage({ data })
    .then((value) => {
      console.log("Pubsub message " + value + " published.");
    });
}

export async function uploadMultipleFilesToBucket(
  records: ImageRecord[],
  bucketId: string
): Promise<FullMetadata[]> {
  const metadata: FullMetadata[] = [];
  const log: string[] = [];

  for (const record of records) {
    if (validateFileName(record.file.name) === false)
      throw new Error("Wrong file name");

    const uploadResult = await uploadSingleFileToBucket(
      record.file.content,
      record.file.name,
      bucketId
    );

    const uploadMessage = "Uploaded " + uploadResult.metadata.fullPath;
    log.push(uploadMessage);
    metadata.push(uploadResult.metadata);
  }

  // This shouldn't care whether the message was published. Hence no "await" directive.
  publishMessage(JSON.stringify(metadata));

  return metadata;
}

async function uploadSingleFileToBucket(
  file: Blob | Uint8Array | ArrayBuffer,
  fileName: string,
  bucketId: string
) {
  if (/\w+\.(jpeg|jpg|png|webm)/.test(fileName) === false)
    throw new Error("Invalid file name");

  const ext = fileName.split(".")[1];

  const imageId = randomUUID();

  const imageRef = ref(
    storage,
    `${bucketId || "uploaded_images"}/${imageId}.${ext}`
  );

  const singleImageUploadResult = uploadBytes(imageRef, file);

  return singleImageUploadResult;
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

function validateFileName(_: string) {
  return true;
}
