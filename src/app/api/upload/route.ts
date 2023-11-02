import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { uploadFilesToBucket } from "../lib/storage";

export type FirebaseFile = {
  content: Uint8Array;
  name: string;
  extension: string;
};

export type ImageRecord = {
  id: string;
  file: FirebaseFile;
};

export async function POST(request: NextRequest) {
  // Verify origin and request

  const data = await request.formData();

  const images: ImageRecord[] = [];

  for (const image of data.entries()) {
    const [name, content] = image;
    const arrayBuffer = await (content as Blob).arrayBuffer();
    const imageIntArray = new Uint8Array(arrayBuffer);
    const id = randomUUID();
    images.push({
      id,
      file: { content: imageIntArray, name, extension: "some" },
    });
  }

  const metadata = await uploadFilesToBucket(images);

  return NextResponse.json(
    {
      status: "success",
      ids: images.map((im) => im.id),
      metadata: metadata,
    },
    { status: 201 }
  );
}
