"use client";

import Image from "next/image";

export default function ImageGrid({ links }: { links: string[] }) {
  return (
    <div>
      {(links as string[]).map((link) => {
        return (
          <Image
            src={link}
            alt='Interesting image'
            width={200}
            height={200}
            className='w-[200px] h-[200px] object-cover'
          />
        );
      })}
    </div>
  );
}
