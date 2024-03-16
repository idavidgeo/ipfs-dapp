import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "./Misc/Spinner";

export default function Files() {
  const [files, setFiles] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Very very ineffective - TODO: need cache layer for cacheThenFetch policy
  useEffect(() => {
    if (!files) {
      setIsLoading(true);
      axios.get("/api/secure/listUploads").then(({ data }) => {
        console.log("uploads: ", data.files);
        setFiles(data.files);
        setIsLoading(false);
      });
    }
  }, []);

  return (
    <section className="px-4 text-white max-w-4xl mx-auto w-full text-center flex flex-col gap-4 items-center justify-center">
      <h3>Uploaded files:</h3>

      <div className="flex flex-col h-[20vh] overflow-y-scroll hideScrollBar bg-neutral-500 w-full rounded-xl items-start p-4 gap-4">
        {files && files.length > 0 ? (
          files.map((file) => (
            <div key={file.hash} className="flex items-center justify-between w-full">
              <span className="text-white max-w-[30%] overflow-hidden whitespace-nowrap overflow-ellipsis inline">{file.name}</span>
              <code className="border shrink-0 text-xs rounded-lg py-1 px-2 border-neutral-500 bg-neutral-800">{file.hash}</code>
            </div>
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
