"use client";

import config from "@/config";
import QRCode from "react-qr-code";

export default function SuccessPage(props: { params: { bucketId: string } }) {
  console.log(props.params.bucketId);

  const { bucketId } = props.params;

  function copyToClipboard() {
    if (!bucketId) throw new Error();

    navigator.clipboard
      .writeText(`${config.NEXT_PUBLIC_HOST}/${bucketId}`)
      .then((val) => {
        console.log(val);
      });
  }

  return (
    <div className='space-y-4'>
      <p>Success! Bucket id is {bucketId}</p>
      <QRCode
        style={{ borderRadius: "10px" }}
        value={`${config.NEXT_PUBLIC_HOST}/${bucketId}`}
        width={400}
        height={400}
      />
      <div>
        <button onClick={copyToClipboard}>Copy to clipboard</button>
      </div>
    </div>
  );
}
