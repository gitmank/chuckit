"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const STATUS_ENUM = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

const FilePage = () => {
  const { code } = useParams();
  const [fileLink, setFileLink] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [status, setStatus] = useState(STATUS_ENUM.LOADING);

  const getDownloadLink = async (code) => {
    try {
      const res = await fetch(`/api/public/download?code=${code}`);
      if (res.status === 200) {
        const { downloadURL, metadata } = await res.json();
        if (downloadURL && metadata) {
          return { downloadURL, metadata };
        }
      } else {
        const { error } = await res.json();
        console.error("GET /download error ", error);
        setStatus(STATUS_ENUM.ERROR);
      }
    } catch (error) {
      console.error("File download error", error);
      setStatus(STATUS_ENUM.ERROR);
    }
  };

  useEffect(() => {
    getDownloadLink(code).then((result) => {
      setFileLink(result.downloadURL);
      setMetadata(result.metadata);
      setStatus(STATUS_ENUM.SUCCESS);
      return result;
    });
  }, [code]);

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
    <main className="flex flex-col justify-around p-2 lg:p-4 items-center text-center w-full min-h-screen h-max bg-black text-white">
      <div className="flex flex-col gap-4 items-center justify-center h-max w-full text-center px-2 -mb-8">
        <a
          href="/"
          className="text-2xl lg:text-4xl font-bold text-blue-400 hover:text-blue-300"
        >
          chuckit.xyz
        </a>
        <p className="text-2xl">💚 &lt;- - - - 📁</p>
        <p className="text-sm">
          you can preview and download your file once it loads
        </p>
      </div>
      <iframe
        src={fileLink || `/error`}
        className="flex w-10/12 h-[500px] justify-center items-center rounded-lg border-white border-2"
      ></iframe>
      <p className="text-center self-center">
        {metadata.name.length > 20
          ? `[${metadata.name.substring(0, 10)}...${metadata.name.slice(-10)}]`
          : `${metadata.name}`}{" "}
        ({(metadata.size / 1000000).toFixed(2)} MB)
      </p>
    </main>
  );
};

export default FilePage;
