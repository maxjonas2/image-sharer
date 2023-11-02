"use client";

export default function BucketPage({ params }: { params: any }) {
  return (
    <div>
      <p>Hello world</p>
      <p>Bucket: {JSON.stringify(params)}</p>
    </div>
  );
}
