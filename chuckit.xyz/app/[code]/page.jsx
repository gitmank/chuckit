"use client";
import NavBar from "@/components/NavBar";
import { useParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const STATUS = {
  LOADING: "loading",
  DOWNLOADING: "downloading",
  SUCCESS: "success",
  ERROR: "error",
};
const FILE_TYPES = {
  image: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/avif",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
    "image/x-icon",
    "image/vnd.microsoft.icon",
    "image/vnd.wap.wbmp",
    "image/x-xbitmap",
  ],
  video: [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-flv",
    "video/x-matroska",
    "video/x-ms-wmv",
  ],
  text: [
    "text/plain",
    "application/pdf",
    "application/epub+zip",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.oasis.opendocument.text",
    "application/rtf",
    "application/vnd.oasis.opendocument.spreadsheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.oasis.opendocument.presentation",
  ],
  audio: [
    "audio/mpeg",
    "audio/ogg",
    "audio/wav",
    "audio/webm",
    "audio/aac",
    "audio/flac",
    "audio/midi",
    "audio/x-midi",
    "audio/x-wav",
    "audio/3gpp",
    "audio/3gpp2",
    "audio/amr",
    "audio/amr-wb",
    "audio/mp3",
    "audio/mp4",
    "audio/x-aiff",
    "audio/x-ms-wma",
  ],
};

const FilePage = () => {
  const { code } = useParams();
  const [fileLink, setFileLink] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [status, setStatus] = useState(STATUS.LOADING);
  const [key, setKey] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.href;
      setKey(path.split("#").pop());
    }
  }, []);

  useEffect(() => {
    const getDownloadLink = async (code) => {
      try {
        const res = await fetch(`/api/public/download?code=${code}`);
        if (res.status === 200) {
          const { downloadURL, metadata } = await res.json();
          if (downloadURL && metadata) {
            setFileLink(downloadURL);
            setMetadata(metadata);
            setStatus(STATUS.DOWNLOADING);
          }
        } else {
          const { error } = await res.json();
          console.error("GET /download error ");
          setStatus(STATUS.ERROR);
        }
      } catch (error) {
        console.error("File download error");
        setStatus(STATUS.ERROR);
      }
    };
    getDownloadLink(code);
  }, [code]);

  useEffect(() => {
    const downloadFile = async () => {
      try {
        const result = await fetch(fileLink);
        if (result.status === 200) {
          setStatus(STATUS.SUCCESS);
          const blob = await result.blob();
          const decBlob = await decryptBlob(await blob.arrayBuffer());
          const url = URL.createObjectURL(decBlob);
          const a = document.getElementById("download-link");
          a.href = url;
          a.download = metadata.name;
          a.textContent = "Confirm Download ⬇️";
          // preview file
          generatePreview(url, metadata);
        } else {
          setStatus(STATUS.ERROR);
        }
      } catch (error) {
        console.error("File download error", error);
        setStatus(STATUS.ERROR);
      }
    };
    if (key && fileLink && metadata) {
      downloadFile();
    }
  }, [fileLink]);

  const decryptBlob = async (data) => {
    try {
      // prepare key and iv
      const keyBytes = new Uint8Array(
        key.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
      );
      const iv = Object.values(metadata.iv);
      const ivBytes = new Uint8Array(iv);
      // decrypt file using aes-js
      const aesjs = await import("aes-js");
      const dataBytes = new Uint8Array(data);
      const aesCBC = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
      const decryptedBytes = aesCBC.decrypt(dataBytes);
      const decryptedBlob = new Blob([decryptedBytes], { type: metadata.type });
      return decryptedBlob;
    } catch (error) {
      console.log("error encrypting file", error);
      setStatus(STATUS.ERROR);
    }
  };
  const generatePreview = (url, metadata) => {
    const previewPane = document.getElementById("preview-pane");
    if (FILE_TYPES.image.includes(metadata.type)) {
      const img = document.createElement("img");
      img.src = url;
      img.alt = metadata.name;
      img.className = "w-full h-full object-contain";
      previewPane.appendChild(img);
    } else if (FILE_TYPES.video.includes(metadata.type)) {
      const video = document.createElement("video");
      video.src = url;
      video.controls = true;
      video.className = "w-full h-full object-contain";
      previewPane.appendChild(video);
    } else if (FILE_TYPES.text.includes(metadata.type)) {
      const text = document.createElement("iframe");
      text.src = url;
      text.className = "w-full h-full object-contain";
      previewPane.appendChild(text);
    } else if (FILE_TYPES.audio.includes(metadata.type)) {
      const audio = document.createElement("audio");
      audio.src = url;
      audio.controls = true;
      audio.className = "w-full h-full object-contain";
      previewPane.appendChild(audio);
    } else {
      const text = document.createElement("p");
      text.textContent = "Preview unavailable for this file type.";
      previewPane.appendChild(text);
    }
  };

  if (status === STATUS.LOADING) {
    return (
      <main className="flex flex-col justify-center items-center text-center w-full h-screen gap-8 animate-pulse bg-black text-white">
        <h1 className="text-4xl">chuckit.xyz</h1>
        <p className="text-4xl">🔎</p>
        <h1 className="text-xl">Finding your file</h1>
      </main>
    );
  }

  if (status === STATUS.ERROR) {
    return (
      <main className="flex flex-col justify-center items-center text-center w-full h-screen gap-8 bg-black text-white">
        <h1 className="text-4xl">chuckit.xyz</h1>
        <p className="text-4xl">🚫</p>
        <h1 className="text-xl">File not found</h1>
        <a href="/" className="underline">
          Return Home
        </a>
      </main>
    );
  }
  return (
    <>
      <NavBar />
      <main className="flex mt-14 flex-col justify-start gap-8 px-4 pt-8 items-center text-center w-full min-h-screen h-max bg-black text-white">
        <div
          id="preview-pane"
          className="flex justify-center items-center w-full lg:w-8/12 border-white border-2 h-[450px] lg:h-[600px] rounded-md"
        ></div>
        <div className="flex flex-col w-max h-max justify-center items-center gap-4">
          <a
            id="download-link"
            className="flex h-max w-max justify-center items-center bg-white text-black rounded-full p-2 px-4 hover:bg-green-500 hover:text-white transition-all duration-100 ease-in-out"
          >
            preparing download ⏳
          </a>
          <p className="text-center self-center text-sm">
            {metadata.name.length > 25
              ? `[${metadata.name.substring(0, 10)}...${metadata.name.slice(
                  -10
                )}]`
              : `${metadata?.name}`}{" "}
            ({(metadata.size / 1000000).toFixed(2)} MB)
          </p>
        </div>
      </main>
    </>
  );
};

export default FilePage;
