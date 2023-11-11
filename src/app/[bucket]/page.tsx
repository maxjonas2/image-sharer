import Image from "next/image";
import ImageGrid from "../ui/ImageGrid";
import config from "@/config";

export default async function BucketPage({
  params,
}: {
  params: { bucket: string };
}) {
  const { bucket } = params;

  const response = await fetch(
    `${config.NEXT_PUBLIC_HOST}/api/files/` + bucket,
    {
      next: { revalidate: 10 },
    }
  );
  const { downloadLinks } = await response.json();

  return (
    <div>
      <p>Hello world</p>
      <ImageGrid links={downloadLinks} />
    </div>
  );
}
