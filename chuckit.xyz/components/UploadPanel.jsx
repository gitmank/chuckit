"use client";
import { useState, useEffect } from "react";

// custom components
import CopyLink from "./small/CopyLink";

// ui components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

// constants
const UPLOAD_LIMIT = 20 * 1024 * 1024;
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

export default function UploadPanel() {
  // state for input file, upload URL and resulting link
  const [inputFile, setInputFile] = useState(null);
  const [uploadURL, setUploadURL] = useState(null);
  const [fileLink, setFileLink] = useState(null);
  // state for loading, dragging and errors
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(false);

  // effect to handle file upload in an event driven way
  useEffect(() => {
    if (inputFile) {
      handleSubmit();
    }
  }, [inputFile]);

  useEffect(() => {
    if (uploadURL) {
      uploadFile();
    }
  }, [uploadURL]);

  // event handlers
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

  const handleInputClick = (e) => {
    e.preventDefault();
    const input = document.getElementById("file-input");
    input.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setError(false);
    if (loading) return;
    const input = document.getElementById("file-input");
    let files = e.dataTransfer?.files || e.target?.files;
    if (!files) return;
    if (files.length !== 1) {
      alert("upload a single file");
      setError(true);
      return;
    }
    setInputFile(files[0]);
    setFileLink(null);
  };

  const handleInputChange = (e) => {
    if (loading) return;
    if (!e?.target?.files[0]) {
      setError(true);
      return;
    }
    setInputFile(e.target.files[0]);
    setFileLink(null);
  };

  const handleSubmit = async () => {
    if (inputFile) {
      setLoading(true);
      if (inputFile.size > UPLOAD_LIMIT) {
        alert(`file size limit ${UPLOAD_LIMIT / 1024 / 1024} MB`);
        setInputFile(null);
        setLoading(false);
      } else {
        const result = await getUploadLink();
        if (result) {
          setUploadURL(result);
        } else {
          setError(true);
        }
      }
    }
  };

  const getUploadLink = async () => {
    try {
      const metadata = {
        name: inputFile.name,
        size: inputFile.size,
        type: inputFile.type,
        extension: inputFile.name.split(".").pop(),
      };
      const response = await fetch("/api/public/upload", {
        method: "POST",
        body: JSON.stringify(metadata),
      });
      if (response.status !== 200) {
        const { error } = await response.json();
        console.error("POST /upload error");
        alert(error);
        setInputFile(null);
        return null;
      }
      const result = await response.json();
      setFileLink(`https://chuckit.xyz/${result.fileCode}`);
      return result.uploadURL;
    } catch (error) {
      console.error("POST /upload error");
    }
  };

  const uploadFile = async () => {
    try {
      const response = await fetch(uploadURL, {
        method: "PUT",
        body: inputFile,
        headers: {
          "Content-Type": inputFile.type,
          "X-Upload-Content-Length": inputFile.size,
        },
      });
      if (response.status !== 200) {
        console.error("PUT /upload error");
      }
      setLoading(false);
      setError(false);
    } catch (error) {
      console.error("PUT /upload error", error);
    }
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
          quickly share non-sensitive files
        </p>
      </div>
      {inputFile ? (
        <Card className="w-full min-h-[300px] max-w-lg flex flex-col justify-center gap-8 items-center border-white duration-1000">
          <div className="flex flex-col gap-4 justify-center items-center w-full h-max p-1">
            <p className="text-center text-base">
              {inputFile.name.length > 20
                ? `${inputFile.name.slice(0, 20)}...`
                : inputFile.name}
            </p>
            <p className="text-4xl">{FILE_ICONS[inputFile?.type] || "📁"}</p>
            <p>
              {inputFile.size > 1000000
                ? `${(inputFile.size / 1000000).toFixed(2)} MB`
                : `${(inputFile.size / 1000).toFixed(2)} KB`}
            </p>
          </div>
          {loading && <p className="animate-spin">⏳</p>}
          <div className="flex flex-col items-center justify-center w-full gap-4 h-max">
            {fileLink && !loading ? (
              <CopyLink link={fileLink} />
            ) : (
              <Button
                onClick={() => {
                  setInputFile(null);
                  setFileLink(null);
                  setLoading(false);
                  setError(false);
                  setUploadURL(null);
                }}
                className="bg-red-400 text-white text-xs rounded-full h-max hover:bg-red-500"
              >
                Clear
              </Button>
            )}
          </div>
          <CardFooter className={error ? "" : "hidden"}>
            <Badge className="bg-red-500 text-white text-sm">
              upload error
            </Badge>
          </CardFooter>{" "}
        </Card>
      ) : (
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
          />
          <CardFooter className={error ? "" : "hidden"}>
            <Badge className="bg-red-500 text-white text-sm">
              invalid file
            </Badge>
          </CardFooter>
        </Card>
      )}
      <div className="mt-4 text-center text-base">
        <p className="text-balance text-foreground bg-destructive mb-4 px-1 text-sm md:text-base">
          1 week expiry, 20MB limit, 25 downloads, unsafe
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="rounded-full text-xs p-1 px-3" variant="outline">
              ⚠️&nbsp;&nbsp;Security Alert
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-11/12 rounded-md">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Please create a free account &lt;3
              </AlertDialogTitle>
              <AlertDialogDescription>
                <p className="text-red-400 text-base">Public Access Warning</p>
                <p>
                  When shared with direct drag and drop, anyone with the link
                  can access your files. Please refrain from uploading any
                  sensitive information without an account. An account will help
                  us encrypt your data.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="text-white">
                I understand
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
