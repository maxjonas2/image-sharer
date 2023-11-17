"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import UploadBlob from "./UploadBlob";

export default function UploadContainer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  const [dragEnter, setDragEnter] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [awaitingUpload, setAwaitingUpload] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bucketId, setBucketId] = useState<string | null>(null);

  const router = useRouter();

  async function handleFileInput(files: File[]) {
    if (!files) throw new Error("No files");
    setFiles(files);
  }

  async function uploadFiles(files: File[]) {
    const formData = new FormData();

    for (const file of files) {
      formData.append(file.name, file);
    }

    setAwaitingUpload(true);

    const response = await fetch("api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    setAwaitingUpload(false);

    if (response.ok) {
      setTimeout(() => {
        router.push(`/success/${result.bucketId}`);
      }, 2000);
    } else {
      setError("There was an error.");
    }

    console.log(result);
  }

  async function handleFileUpload() {
    if (files.length === 0) throw new Error("Ref not initialized");

    await uploadFiles(files);
  }

  useEffect(() => {
    let dragArea;
    if (!(dragArea = dragAreaRef.current)) return;
    console.log(dragArea);

    dragArea.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    dragArea.addEventListener("dragenter", () => {
      setDragEnter(true);
    });

    dragArea.addEventListener("dragleave", () => {
      // setDragEnter(false);
    });

    dragArea.addEventListener("drop", (e) => {
      e.preventDefault();
      getFilesFromDrag(e);
    });
  }, []);

  async function getFilesFromDrag(e: DragEvent) {
    const fileHandlesPromises = [...e.dataTransfer!.items]
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile());

    const files = fileHandlesPromises;

    if (files.length === 0 || files.some((file) => file === null))
      throw new Error("No files");

    handleFileInput(files as File[]);
  }

  if (awaitingUpload) {
    return (
      <div className='h-screen grid place-content-center'>
        Uploading files...
      </div>
    );
  }

  if (error) {
    return <div className='h-screen grid place-content-center'>{error}</div>;
  }

  return (
    <>
      <form action='' className='centered flex-col'>
        <div
          ref={dragAreaRef}
          className={
            "transition-transform " + (dragEnter ? "will-receive-file" : "")
          }
        >
          <UploadBlob />
        </div>
        <div className='flex flex-col'></div>
      </form>
      <div className='mt-8'>
        {files.length === 0 ? (
          <div className='centered flex-col'>
            <picture>
              <img
                width={50}
                src='/assets/uploadArrow.svg'
                className='animate-bounce motion-reduce:animate-none'
              />
            </picture>
            <p className='mt-4 text-[--text-strong] font-bold'>
              Drop images on blob
            </p>
            <p className='mt-4 text-[--text-strong] font-bold text-lg'>OR</p>
            <div className='controls mt-4 text-[--text-strong] font-bold text-lg'>
              <button className='w-[148px] h-[38px] centered text-white bg-[--text-strong] shadow-xl shadow-pink-600/20 rounded-lg'>
                Browse
              </button>
            </div>
          </div>
        ) : null}
        <FilePreview files={files} />
      </div>
      <div>
        <form action='' onInput={(e) => console.log(e.currentTarget)}>
          <input
            hidden
            type='file'
            multiple
            ref={inputRef}
            onInput={(e) => handleFileInput([...e.currentTarget.files!])}
          />
        </form>
        {bucketId && (
          <div>
            <p>Files uploaded!</p>
            <p>Code : {bucketId}</p>
          </div>
        )}
      </div>
    </>
  );
}

function FilePreview({ files }: { files: File[] }) {
  //   if (files.length === 0) return null;

  const urls = files.map((file) => {
    const url = URL.createObjectURL(new Blob([file], { type: file.type }));
    console.log(url);
    return url;
  });

  return (
    <>
      <div className='flex flex-wrap gap-4 p-[2rem]'>
        {urls.map((url) => {
          return (
            <img
              key={url}
              src={url}
              alt='Uploaded image'
              width={120}
              height={120}
              className='object-cover rounded-md w-[120px] h-[120px] shadow-lg'
            />
          );
        })}
      </div>
    </>
  );
}
