import { ImageRecord } from "../upload/route";
import { app } from "./firebase";
import { FullMetadata, getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage(app);

export async function uploadFilesToBucket(
  records: ImageRecord[]
): Promise<FullMetadata[]> {
  const metadata: FullMetadata[] = [];

  for (const record of records) {
    const imageRef = ref(storage, "uploaded_files/" + record.id + ".png");
    const uploadResult = await uploadBytes(imageRef, record.file.content);
    console.log("Uploaded " + uploadResult.metadata.fullPath);
    metadata.push(uploadResult.metadata);
  }

  return metadata;
}
