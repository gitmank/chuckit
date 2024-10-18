"use client";
import { useState, useEffect } from "react";
import aesjs from "aes-js";

// custom components
import CopyLink from "./small/CopyLink";

// ui components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import PopUp from "@/components/small/PopUp";

// constants
const UPLOAD_LIMIT = 900 * 1024 * 1024; // 900MB
const FILE_ICONS = {
  // image
  "image/jpeg": "🖼️",
  "image/jpg": "🖼️",
  "image/png": "🌌",
  "image/gif": "🎆",
  // documents
  "application/msword": "📄",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "📄",
  "application/pdf": "📄",
  "application/vnd.ms-excel": "📊",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "📊",
  "application/vnd.ms-powerpoint": "🪧",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "🪧",
  "application/vnd.apple.keynote": "🪧",
  "application/vnd.apple.pages": "📄",
  "application/vnd.apple.numbers": "📊",
  // audio video
  "audio/mpeg": "🎵",
  "audio/ogg": "🎵",
  "audio/wav": "🎵",
  // mp3
  "video/mp4": "🎥",
  "video/quicktime": "🎥",
  "video/ogg": "🎥",
  "video/webm": "🎥",
  // zip
  "application/zip": "🗂️",
  "application/x-7z-compressed": "🗂️",
  "application/x-rar-compressed": "🗂️",
  "application/x-tar": "🗂️",
  "application/x-gzip": "🗂️",
  // text
  "text/plain": "📄",
  "text/html": "🌐",
  "text/css": "🎨",
  "text/csv": "📊",
  "text/calendar": "🗓️",
  // code
  "application/json": "{ 📄 }",
  "text/javascript": "{ 📄 }",
  "text/typescript": "{ 📄 }",
  "text/php": "{ 📄 }",
  "text/x-python-script": "{ 🐍 }",
  // books
  "application/epub+zip": "📚",
  "application/vnd.amazon.ebook": "📚",
  "application/x-mobipocket-ebook": "📚",
  // others
  "application/octet-stream": "[0101]",
};
const STATUS = {
  READY: "READY",
  LOADING: "LOADING",
  ENCRYPTING: "ENCRYPTING",
  UPLOADING: "UPLOADING",
  FILE_ERROR: "FILE_ERROR",
  ENC_ERROR: "ENC_ERROR",
  UPLOAD_ERROR: "UPLOAD_ERROR",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
};

export default function UploadPanel() {
  // state for result link
  const [fileLink, setFileLink] = useState(null);
  const [inputFile, setInputFile] = useState(null);
  const [encResult, setEncResult] = useState({});
  // state for loading, errors and dragging UI
  const [status, setStatus] = useState(STATUS.READY);
  const [dragging, setDragging] = useState(false);

  // encrypt file on input
  useEffect(() => {
    const encryptFile = async () => {
      setStatus(STATUS.ENCRYPTING);
      try {
        // generate iv + key
        const generateAESKey = async () => {
          const key = await crypto.subtle.generateKey(
            {
              name: "AES-CBC",
              length: 128,
            },
            true,
            ["encrypt", "decrypt"]
          );
          const keyBytes = await crypto.subtle.exportKey("raw", key);
          return new Uint8Array(keyBytes);
        };
        // encrypt file using aes-js
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = new Uint8Array(e.target.result);
          const key = await generateAESKey();
          const iv = await generateAESKey();
          const aesCBC = new aesjs.ModeOfOperation.cbc(key, iv);
          const paddedBytes = aesjs.padding.pkcs7.pad(data);
          const encryptedBytes = aesCBC.encrypt(paddedBytes);
          const encryptedBlob = new Blob([encryptedBytes], {
            type: "application/octet-stream",
          });
          const readableKey = Array.from(key)
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("");
          const result = {
            key: readableKey,
            iv: iv,
            blob: encryptedBlob,
          };
          setTimeout(() => {
            setEncResult(result);
          }, 1000);
        };
        reader.readAsArrayBuffer(inputFile);
      } catch (error) {
        console.log("error encrypting file");
        setStatus(STATUS.ENC_ERROR);
      }
    };
    if (inputFile) {
      encryptFile();
    }
  }, [inputFile]);

  // upload file on ecnryption result
  useEffect(() => {
    const getUploadLink = async () => {
      setStatus(STATUS.UPLOADING);
      try {
        const metadata = {
          name: inputFile.name,
          size: encResult.blob.size,
          type: inputFile.type,
          extension: inputFile.name.split(".").pop(),
          iv: encResult.iv,
        };
        const response = await fetch("/api/public/upload", {
          method: "POST",
          body: JSON.stringify(metadata),
        });
        if (response.status !== 200) {
          const { error } = await response.json();
          console.error("POST /upload error", error);
          alert(error);
          setStatus(STATUS.UPLOAD_ERROR);
        }
        const result = await response.json();
        setFileLink(`https://chuckit.xyz/${result.fileCode}#${encResult.key}`);
        const uploaded = await uploadFile(result.uploadURL);
        if (uploaded) {
          setStatus(STATUS.SUCCESS);
        }
      } catch (error) {
        console.error("POST /upload error");
        setStatus(STATUS.UPLOAD_ERROR);
      }
    };
    if (encResult?.blob && encResult?.key) {
      getUploadLink();
    }
  }, [encResult]);

  // upload file to GCS
  const uploadFile = async (uploadURL) => {
    try {
      const response = await fetch(uploadURL, {
        method: "PUT",
        body: encResult.blob,
        headers: {
          "Content-Type": "application/octet-stream",
          "X-Upload-Content-Length": encResult.blob.size,
        },
      });
      if (response.status !== 200) {
        console.error("PUT /upload error", response.status);
        setStatus(STATUS.UPLOAD_ERROR);
      } else {
        return true;
      }
    } catch (error) {
      console.error("PUT /upload error");
      setStatus(STATUS.UPLOAD_ERROR);
    }
  };

  // handle DOM events
  const handleDragEnter = (e) => {
    e.preventDefault();
    if (status === STATUS.LOADING) return;
    setDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    if (status === STATUS.LOADING) return;
    setDragging(false);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    if (status === STATUS.LOADING) return;
    setDragging(true);
  };
  const handleInputClick = (e) => {
    e.preventDefault();
    const input = document.getElementById("file-input");
    input.click();
  };
  const handleClear = () => {
    setInputFile(null);
    setFileLink(null);
    setEncResult({});
    setStatus(STATUS.READY);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (status === STATUS.LOADING) return;
    setInputFile(null);
    let files = e.dataTransfer?.files || e.target?.files;
    if (
      !files ||
      files.length !== 1 ||
      !files[0].size ||
      files[0].size > UPLOAD_LIMIT
    ) {
      setStatus(STATUS.FILE_ERROR);
      return;
    }
    handleClear();
    setInputFile(files[0]);
    setStatus(STATUS.LOADING);
  };
  const handleInputChange = (e) => {
    if (status === STATUS.LOADING) return;
    if (
      !e?.target?.files[0] ||
      e.target.files[0].size > UPLOAD_LIMIT ||
      e.target.files.length !== 1
    ) {
      setStatus(STATUS.FILE_ERROR);
      return;
    }
    handleClear();
    setInputFile(e.target.files[0]);
    setStatus(STATUS.LOADING);
  };

  return (
    <div
      className={
        dragging
          ? "flex flex-col gap-4 items-center justify-center py-8 border-b-2 p-4 bg-blue-800 animate-pulse bg-opacity-40"
          : "flex flex-col gap-4 items-center justify-center py-8 border-b-2 p-4"
      }
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">free drag n drop</h1>
        <p className="text-balance text-foreground text-center">
          quickly share sensitive files
        </p>
      </div>
      {inputFile ? (
        <FileCard
          file={inputFile}
          status={status}
          fileLink={fileLink}
          handleClear={handleClear}
        />
      ) : (
        <UploadCard
          handleInputChange={handleInputChange}
          handleInputClick={handleInputClick}
          status={status}
        />
      )}
      <div className="mt-4 text-center text-base">
        <p className="text-balance text-foreground bg-blue-500 mb-4 px-1 text-sm md:text-base">
          1 week expiry, {UPLOAD_LIMIT / 1024 / 1024} MB limit, 25 downloads
        </p>
        <SecurityPopUp />
      </div>
    </div>
  );
}

// page sepcific components
const FileCard = ({ file, status, fileLink, handleClear }) => {
  return (
    <Card className="w-full min-h-[300px] max-w-lg flex flex-col justify-center gap-8 items-center border-white duration-1000">
      <div className="flex flex-col gap-4 justify-center items-center w-full h-max p-1">
        <p className="text-center text-base">
          {file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}
        </p>
        <div className="flex flex-col relative gap-2 text-center justify-center items-center w-max h-max border-white border-2 p-3 rounded-md">
          <button
            onClick={handleClear}
            className="flex w-6 h-6 justify-center items-center rounded-full pb-1 bg-white text-red-400 absolute -top-3 -right-3 hover:bg-red-400 hover:text-white duration-100"
          >
            x
          </button>
          <p className="text-4xl">{FILE_ICONS[file?.type] || "📁"}</p>
        </div>
        <p>
          {file.size > 1000000
            ? `${(file.size / 1000000).toFixed(2)} MB`
            : `${(file.size / 1000).toFixed(2)} KB`}
        </p>
      </div>
      {status === STATUS.SUCCESS && fileLink && <CopyLink link={fileLink} />}
      <StatusMessage status={status} />
    </Card>
  );
};
const UploadCard = ({ handleInputClick, handleInputChange, status }) => {
  return (
    <Card className="w-full min-h-[300px] max-w-lg flex flex-col justify-around items-center border-white duration-1000">
      <section
        onClick={handleInputClick}
        className="flex justify-center items-center w-[100px] h-[100px] rounded-full bg-white border-2 border-white hover:scale-105 duration-100 active:scale-95"
      >
        <p className="text-2xl animate-none text-black">+</p>
      </section>
      <input
        onChange={handleInputChange}
        className="hidden"
        id="file-input"
        type="file"
        size={1}
      />
      <StatusMessage status={status} />
    </Card>
  );
};
const StatusMessage = ({ status }) => {
  if (status === STATUS.READY) {
    return (
      <Badge className="bg-foreground text-black text-sm">
        📁- - -&gt;🌐 chuck it
      </Badge>
    );
  }
  if (status === STATUS.LOADING) {
    return (
      <Badge className="bg-transparent text-white text-sm animate-spin">
        ⏳
      </Badge>
    );
  }
  if (status === STATUS.ENCRYPTING) {
    return (
      <Badge className="bg-green-500 text-white text-sm">
        🔐 encrypting file
      </Badge>
    );
  }
  if (status === STATUS.UPLOADING) {
    return (
      <Badge className="bg-blue-400 text-white text-sm">
        📤 uploading file
      </Badge>
    );
  }
  if (status === STATUS.FILE_ERROR) {
    return (
      <Badge className="bg-red-500 text-white text-sm">
        upload single file &lt; {UPLOAD_LIMIT / 1024 / 1024} MB
      </Badge>
    );
  }
  if (status === STATUS.ENC_ERROR) {
    return (
      <Badge className="bg-red-500 text-white text-sm">
        🔓 could not encrypt file
      </Badge>
    );
  }
  if (status === STATUS.UPLOAD_ERROR) {
    return (
      <Badge className="bg-red-500 text-white text-sm">
        ⛓️‍💥 could not upload file
      </Badge>
    );
  }
  if (status === STATUS.ERROR) {
    return (
      <Badge className="bg-red-500 text-white text-sm">
        🫠 something went wrong
      </Badge>
    );
  }
  if (status === STATUS.SUCCESS) {
    return <></>;
  }
};
const SecurityPopUp = () => {
  return (
    <PopUp
      openButtonText={"🔐 100% secure"}
      title={"Your files are safe, as long as your link is 💚"}
      closeButtonText={"I understand"}
    >
      <p className="text-green-500 text-base font-bold">
        🔐 Client-side encryptions
      </p>
      <p>
        We encrypt and decrypt your files in the browser, and the key is never
        sent to our servers or stored with us.
      </p>
      <p className="text-yellow-500 text-base font-bold mt-4">⚠️ Caution</p>
      <p>
        The link is the only way to access your file, make sure to keep it safe
        and share it only with the intended recipient.
      </p>
    </PopUp>
  );
};
