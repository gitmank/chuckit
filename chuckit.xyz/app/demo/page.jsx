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

const FileUploadPage = () => {
  const [dragging, setDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileLink, setFileLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files.length !== 1) {
      alert("upload a single file");
      return;
    }
    setUploadedFile(files[0]);

    // upload file
    const formData = new FormData();
    formData.append("file", files[0]);

    // send request
    try {
      const response = await fetch("/api/public/upload", {
        method: "POST",
        body: formData,
      });
      if (response.status !== 200) {
        const result = await response.json();
        console.error("POST /upload error", result.message);
        alert(result.message);
        setUploadedFile(null);
        return;
      }
      const result = await response.json();
      setFileLink(result.link);
      console.log("POST /upload success", result.message);
    } catch (error) {
      console.error("POST /upload error", error);
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
      className="bg-gray-950 h-screen flex flex-col items-center justify-center text-white p-8 gap-8 duration-100"
    >
      <div
        className={
          dragging
            ? "flex flex-col p-8 bg-blue-500 animate-pulse text-black rounded-lg shadow-lg text-center w-full md:w-1/2 h-1/2 justify-around duration-100"
            : "flex flex-col p-8 bg-white text-black rounded-lg shadow-lg text-center w-full md:w-1/2 h-1/2 justify-around duration-100"
        }
      >
        <div className="flex flex-col text-center items-center justify-center w-full h-max">
          <div>
            <h2 className="text-2xl font-bold mb-4">Drag and Drop Files</h2>
            <input className="hidden" type="file" />
          </div>
        </div>
        {uploadedFile ? (
          <div className="flex flex-col text-center justify-around w-full h-full items-center p-4 gap-4">
            <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
              <p>{uploadedFile.name}</p>
              <p className="text-6xl">
                {FILE_ICONS[uploadedFile?.type] || "📁"}
              </p>
              <p>
                {uploadedFile.size > 1000000
                  ? `${(uploadedFile.size / 1000000).toFixed(2)} MB`
                  : `${(uploadedFile.size / 1000).toFixed(2)} KB`}
              </p>
            </div>
            {/* <div className="w-2/3 md:w-1/2 bg-black rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs animate-pulse mt-2">
                uploaded {uploadProgress}%
              </p>
            </div> */}
            {fileLink ? (
              <p
                onClick={handleCopyLink}
                className="bg-gray-600 text-sm lg:text-base font-mono text-white p-2 px-4 rounded-md shadow-blue-500 shadow-lg duration-100 hover:scale-105 active:scale-95"
              >
                {copied ? "✅ " : "📋 "} {fileLink}
              </p>
            ) : (
              <button
                className="bg-blue-500 text-white p-2 px-4 rounded-md"
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
          tldr - 7 day expiry, 10MB file limit, no custom links yet
        </p>
      </div>
    </main>
  );
};

export default FileUploadPage;
