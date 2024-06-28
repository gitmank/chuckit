"use client";
import React, { useState } from "react";

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
};

const UPLOAD_LIMIT = 20 * 1024 * 1024;

const FileUploadPage = () => {
  const [dragging, setDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileLink, setFileLink] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    if (loading) return;
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (loading) return;
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (loading) return;
    setDragging(true);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setError(false);
    if (loading) return;
    setLoading(true);
    e.preventDefault();
    setDragging(false);
    let files = e.dataTransfer?.files || e.target?.files;
    if (!files || files.length !== 1) {
      alert("upload a single file");
      return;
    }
    if (files[0].size > UPLOAD_LIMIT) {
      alert(`file size limit ${UPLOAD_LIMIT / 1024 / 1024} MB`);
      setError(true);
      return;
    }
    setUploadedFile(files[0]);
    setFileLink(null);

    const metadata = {
      name: files[0].name,
      size: files[0].size,
      type: files[0].type,
      extension: files[0].name.split(".").pop(),
    };

    const linkResult = await getUploadLink(metadata);
    if (!linkResult) {
      setError(true);
      return;
    }
    const fileResult = await uploadFile(files[0], linkResult.uploadURL);
    if (!fileResult) {
      setError(true);
      return;
    }
    setFileLink(`https://chuckit.xyz/${linkResult.fileCode}`);
    setLoading(false);
  };

  const uploadFile = async (file, uploadURL) => {
    try {
      const response = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
          "Content-Length": file.size - 3000,
        },
      });
      if (response.status !== 200) {
        const error = await response.json();
        console.error("PUT /upload error");
        setUploadedFile(null);
        return false;
      }
      return true;
    } catch (error) {
      console.error("PUT /upload error", error);
    }
  };

  const getUploadLink = async (metadata) => {
    try {
      const response = await fetch("/api/public/upload", {
        method: "POST",
        body: JSON.stringify(metadata),
      });
      if (response.status !== 200) {
        const { error } = await response.json();
        console.error("POST /upload error");
        alert(error);
        setUploadedFile(null);
        return;
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("POST /upload error");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fileLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <main
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="bg-gray-950 h-screen flex flex-col items-center justify-center text-white p-4 gap-8 duration-100"
    >
      <div
        className={
          dragging
            ? "flex flex-col p-2 bg-blue-200 animate-pulse text-black rounded-lg shadow-lg text-center w-full md:w-2/3 lg:w-1/2 h-3/5 justify-around duration-100"
            : "flex flex-col p-2 bg-white text-black rounded-lg shadow-lg text-center w-full md:w-2/3 lg:w-1/2 h-3/5 justify-around duration-100"
        }
      >
        <h2 className="text-xl font-bold">Drag and Drop Files</h2>
        <div className="flex flex-col gap-2 items-center justify-center text-center w-full h-max">
          <input
            onChange={handleDrop}
            className="block w-10/12 max-w-[400px] self-center text-sm p-1 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
          />
          <p className="text-sm text-red-400 font-bold">
            {error ? "error uploading file" : ""}
          </p>
        </div>
        {uploadedFile ? (
          <div className="flex flex-col text-center justify-around w-full items-center p-4 gap-4">
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              <p>
                {uploadedFile.name.length > 20
                  ? `${uploadedFile.name.slice(0, 20)}...`
                  : uploadedFile.name}
              </p>
              <p className="text-6xl">
                {FILE_ICONS[uploadedFile?.type] || "📁"}
              </p>
              <p>
                {uploadedFile.size > 1000000
                  ? `${(uploadedFile.size / 1000000).toFixed(2)} MB`
                  : `${(uploadedFile.size / 1000).toFixed(2)} KB`}
              </p>
            </div>
            <p className="text-sm my-auto mx-auto">
              {loading
                ? `uploading file, estimated ${(
                    uploadedFile.size / 1000000
                  ).toFixed(0)} sec`
                : ""}
            </p>
            {fileLink ? (
              <div className="flex flex-col w-full items-center gap-4">
                <p
                  onClick={handleCopyLink}
                  className="bg-gray-600 text-sm lg:text-base font-mono text-white p-1 w-max px-1 rounded-md shadow-blue-500 shadow-lg duration-100 hover:scale-105 active:scale-95"
                >
                  {copied ? "✅ " : "📋 "} {fileLink.split("://")[1]}
                </p>
                <button
                  className="bg-red-400 text-white p-1 text-xs px-4 rounded-md w-max self-center"
                  onClick={() => {
                    setUploadedFile(null);
                    setFileLink(null);
                    setLoading(false);
                    setError(false);
                  }}
                >
                  Clear
                </button>
              </div>
            ) : (
              <button
                className="bg-red-400 text-white p-2 px-4 rounded-md w-max self-center"
                onClick={() => {
                  setUploadedFile(null);
                  setFileLink(null);
                }}
              >
                Clear
              </button>
            )}
          </div>
        ) : (
          <p className="text-6xl animate-pulse">🌀</p>
        )}
      </div>
      <div className="flex flex-col w-full md:w-1/2 h-max items-center text-center justify-center text-white p-2 px-3 rounded-md gap-4">
        <p className="text-base bg-red-400 rounded-full px-3 p-1">
          📍&nbsp;&nbsp;app in development
        </p>
        <p className="text-sm">
          currently - 7 days expiry, 4MB limit, no custom links
        </p>
        <p className="text-sm">
          coming this week - 30 day expiry, 20 MB limit, custom links
        </p>
      </div>
      <a
        href="/"
        className="absolute top-4 left-4 text-2xl font-bold text-blue-400 hover:text-blue-300"
      >
        chuckit.xyz
      </a>
    </main>
  );
};

export default FileUploadPage;
