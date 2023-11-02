"use client";

import { FormEvent, useRef } from "react";

export default function UploadContainer() {
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList) {
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

    await uploadFiles(inputRef.current.files);
  }

  return (
    <>
      <form action='' onSubmit={handleFileUpload}>
        <div className='flex flex-col'>
          <label htmlFor=''>Pick images</label>
          <input type='file' multiple ref={inputRef} />
          <button type='submit'>Upload</button>
        </div>
      </form>
      <div className='image-drag-area h-32 border-2 border-slate-200 border-dashed'></div>
    </>
  );
}
