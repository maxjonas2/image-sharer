"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

export default function UploadContainer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  const [dragEnter, setDragEnter] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  async function handleFileInput(files: File[]) {
    if (!files) throw new Error("No files");
    setFiles(files);
  }

  async function uploadFiles(files: File[]) {
    const formData = new FormData();

    for (const file of files) {
      formData.append(file.name, file);
    }

    const response = await fetch("api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    console.log(result);
  }

  async function handleFileUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.dir(inputRef.current);

    if (!inputRef.current || !inputRef.current.files)
      throw new Error("Ref not initialized");

    await uploadFiles([...inputRef.current.files]);
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
      setDragEnter(false);
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

  return (
    <>
      <form action='' onSubmit={handleFileUpload}>
        <div className='flex flex-col'>
          <label htmlFor=''>Pick images</label>
          <input
            type='file'
            multiple
            ref={inputRef}
            onInput={(e) => handleFileInput([...e.currentTarget.files!])}
          />
          <button type='submit'>Upload</button>
        </div>
      </form>
      <div
        ref={dragAreaRef}
        className='image-drag-area h-32 border-2 border-slate-200 border-dashed'
      ></div>
      <div>
        <FilePreview files={files} />
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
    <div className='flex flex-wrap gap-4'>
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
  );
}
