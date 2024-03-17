import React from "react";
import Spinner from "./Misc/Spinner";

export default function Files({ uploaded, isLoading }) {
  return (
    <section className="px-4 text-white max-w-4xl mx-auto w-full text-center flex flex-col gap-4 items-center justify-center">
      <h3>Uploaded files:</h3>

      <div className="flex flex-col h-[20vh] overflow-y-scroll hideScrollBar bg-neutral-500 w-full rounded-xl items-start p-4 gap-4">
        {uploaded && uploaded.length > 0 ? (
          uploaded.map((file, i) => (
            <React.Fragment key={file.name}>
              <div className="flex items-center flex-wrap justify-between w-full">
                <span className="text-white overflow-hidden whitespace-nowrap overflow-ellipsis inline">{file.name}</span>
                <a className="text-blue-400 font-bold text-xs" href={process.env.NEXT_PUBLIC_PINATA_IPFS_GATEWAY + file.hash} target="_blank">
                  Open
                </a>
                <code className="border shrink-0 text-xs rounded-lg py-1 px-2 border-neutral-500 bg-neutral-800">{file.hash}</code>
              </div>
              {i < uploaded.length - 1 && <hr className="w-full border-neutral-400" />}
            </React.Fragment>
          ))
        ) : isLoading ? (
          <Spinner className="size-12 self-center" />
        ) : (
          <span className="self-center text-neutral-300">No files uploaded</span>
        )}
      </div>
    </section>
  );
}
