"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const STATUS_ENUM = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

const FilePage = () => {
  const { filename } = useParams();
  const [fileLink, setFileLink] = useState(null);
  const [status, setStatus] = useState(STATUS_ENUM.LOADING);
  const [file, setFile] = useState(null);
  let originalName;

  useEffect(() => {
    fetch(`/api/public/download?file=${filename}`)
      .then((res) => {
        if (res.ok) {
          setFileLink(res.headers.get("X-public-url"));
          setStatus(STATUS_ENUM.SUCCESS);
          originalName = res.headers
            .get("Content-Disposition")
            .split("=")
            .pop()
            .replace(/"/g, "");
          return res.blob();
        } else {
          throw new Error("File download error");
        }
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = originalName || `chuckit-${filename}`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("File download error", error);
        setStatus(STATUS_ENUM.ERROR);
      });
  }, [filename]);

  if (status === STATUS_ENUM.LOADING) {
    return (
      <main className="flex flex-col justify-center items-center text-center w-full h-screen gap-8 animate-pulse bg-black text-white">
        <h1 className="text-4xl">chuckit.xyz</h1>
        <p className="text-4xl">🔎</p>
        <h1 className="text-xl">Finding your file</h1>
      </main>
    );
  }

  if (status === STATUS_ENUM.ERROR) {
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
    <main className="flex flex-col justify-center items-center text-center w-full h-screen gap-12 bg-black text-white">
      <h1 className="text-4xl">chuckit.xyz</h1>
      <p className="text-4xl">💚 &lt;- - - - 📁</p>
      <h1 className="text-xl">download started</h1>
      <div className="text-center">
        <p className="text-sm">Your download should complete soon,</p>
        <p className="text-sm">
          but here's a&nbsp;
          <a
            href={fileLink}
            title={originalName}
            download={originalName || `chuckit-${filename}`}
            target="_blank"
            className="underline"
          >
            direct link
          </a>
          &nbsp;just in case.
        </p>
      </div>
    </main>
  );
};

export default FilePage;
