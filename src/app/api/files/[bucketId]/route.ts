import { NextRequest, NextResponse } from "next/server";
import { getDownloadLinks } from "../../lib/storage";

export async function GET(
  _: NextRequest,
  { params }: { params: { bucketId: string } }
) {
  const downloadLinks = await getDownloadLinks(params.bucketId);
  return NextResponse.json({ downloadLinks }, { status: 200 });
}
