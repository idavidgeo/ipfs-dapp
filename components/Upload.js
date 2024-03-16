/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function Upload() {
  const { address, isConnected } = useAccount();
  const [imgData, setImgData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function fileDragged(e) {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (e.dataTransfer.files.length + imgData.length > 1) {
        window.alert("One file at a time please!");
        return;
      }
      console.log("image(s) dragged n dropped!");
      console.log(e.dataTransfer.files);
      setImgData([...imgData, ...e.dataTransfer.files]);
    }
  }

  function fileAdded(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      console.log("image(s) added via select!");
      console.log(e.target.files);
      if (e.target.files.length + imgData.length > 1) {
        window.alert("One file at a time please!");
        return;
      }
      setImgData([...imgData, ...e.target.files]);
    }
  }

  function removeImg(at) {
    setImgData(imgData.filter((i, index) => index !== at));
  }

  // NOTE: Very inefficient!!!!! - TODO: add cache layer and optimistic updates (w/revert on fail)
  function onUpload() {
    if (!imgData) {
      return;
    }
    setIsLoading(true);

    console.log("Uploading: ", imgData[0]);
    const headers = { "Content-Type": "multipart/form-data" };

    axios.post("/api/secure/upload?fileName=" + imgData[0].name, imgData[0], headers).then((data) => {
      console.log("Upload: ", data);
      setImgData([]);
      setIsLoading(false);
    });
  }

  return (
    <section className="px-4 text-white max-w-4xl mx-auto w-full text-center flex flex-col gap-4 items-center justify-center">
      <div className="flex items-center justify-center w-full">
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={fileDragged}
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center w-full border-2 border-neutral-400 border-dashed rounded-xl cursor-pointer bg-neutral-700  hover:border-blue-500 ${
            imgData.length > 4 && "!bg-neutral-50 !cursor-not-allowed"
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-10 h-10 mb-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mb-2 text-sm text-neutral-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-neutral-500">PNG, or JPG (MAX. 1 image)</p>
          </div>
          <input multiple disabled={isLoading} onChange={fileAdded} accept="image/png, image/jpeg" id="dropzone-file" type="file" className="hidden" />
        </label>
      </div>

      {imgData.length > 0 && (
        <div className="flex gap-4 w-full flex-wrap max-w-full bg-neutral-600 rounded-xl p-2 px-4">
          {imgData.map((item, i) => {
            return (
              <div key={i} className="relative w-full flex items-center justify-between">
                <img className="size-14 object-cover rounded-lg shrink-0 bg-white" src={URL.createObjectURL(item)} alt="Upload preview" />
                <span className="text-white max-w-[50%] overflow-hidden whitespace-nowrap overflow-ellipsis inline">{item.name}</span>
                <button type="button" onClick={() => removeImg(i)} className="bg-neutral-500 rounded-full p-1">
                  <svg viewBox="0 0 72 72" width="24px" height="24px" className="fill-red-500 ">
                    <path d="M 32.5 9 C 28.364 9 25 12.364 25 16.5 L 25 18 L 17 18 C 14.791 18 13 19.791 13 22 C 13 24.209 14.791 26 17 26 L 17.232422 26 L 18.671875 51.916016 C 18.923875 56.449016 22.67875 60 27.21875 60 L 44.78125 60 C 49.32125 60 53.076125 56.449016 53.328125 51.916016 L 54.767578 26 L 55 26 C 57.209 26 59 24.209 59 22 C 59 19.791 57.209 18 55 18 L 47 18 L 47 16.5 C 47 12.364 43.636 9 39.5 9 L 32.5 9 z M 32.5 16 L 39.5 16 C 39.775 16 40 16.224 40 16.5 L 40 18 L 32 18 L 32 16.5 C 32 16.224 32.225 16 32.5 16 z M 36 28 C 37.104 28 38 28.896 38 30 L 38 47.923828 C 38 49.028828 37.104 49.923828 36 49.923828 C 34.896 49.923828 34 49.027828 34 47.923828 L 34 30 C 34 28.896 34.896 28 36 28 z M 27.392578 28.001953 C 28.459578 27.979953 29.421937 28.827641 29.460938 29.931641 L 30.085938 47.931641 C 30.123938 49.035641 29.258297 49.959047 28.154297 49.998047 C 28.131297 49.999047 28.108937 50 28.085938 50 C 27.012938 50 26.125891 49.148359 26.087891 48.068359 L 25.462891 30.068359 C 25.424891 28.964359 26.288578 28.040953 27.392578 28.001953 z M 44.607422 28.001953 C 45.711422 28.039953 46.575109 28.964359 46.537109 30.068359 L 45.912109 48.068359 C 45.874109 49.148359 44.986063 50 43.914062 50 C 43.891062 50 43.868703 49.999047 43.845703 49.998047 C 42.741703 49.960047 41.876063 49.035641 41.914062 47.931641 L 42.539062 29.931641 C 42.577062 28.827641 43.518422 27.979953 44.607422 28.001953 z" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      <button
        disabled={isLoading || imgData.length < 1}
        onClick={onUpload}
        className="text-white w-full text-lg self-end sm:w-40 bg-green-600 hover:opacity-80 disabled:bg-stone-600 disabled:cursor-not-allowed active:shadow-none font-bold px-4 p-2 rounded-full shadow select-none hideBtnHighlight"
        type="button"
      >
        {isLoading ? "Uploading..." : "Upload"}
      </button>
    </section>
  );
}
