"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const STATUS = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

const VerifyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState(STATUS.LOADING);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
        if (response.status !== 200) setStatus(STATUS.ERROR);
        else {
          setStatus(STATUS.SUCCESS);
          setTimeout(() => {
            router.push("/");
          }, 1000);
        }
      } else {
        setStatus(STATUS.ERROR);
        document.cookie = `token=${"hello"}; path=/; secure; HttpOnly; SameSite=Strict`;
      }
    };
    verifyToken();
  }, []);

  if (status === STATUS.LOADING) {
    return (
      <main className="flex flex-col justify-center items-center text-center w-full h-screen gap-8 animate-pulse bg-black text-white">
        <h1 className="text-4xl">chuckit.xyz</h1>
        <p className="text-4xl">🔑</p>
        <h1 className="text-xl">verifying your account</h1>
      </main>
    );
  }

  if (status === STATUS.ERROR) {
    return (
      <main className="flex flex-col justify-center items-center text-center w-full h-screen gap-8 bg-black text-white">
        <h1 className="text-4xl">chuckit.xyz</h1>
        <p className="text-4xl">🚫</p>
        <h1 className="text-xl">You followed an invalid link.</h1>
        <a href="/" className="underline">
          Return Home
        </a>
      </main>
    );
  }

  return (
    <main className="flex flex-col justify-center items-center text-center w-full h-screen gap-8 bg-black text-white">
      <h1 className="text-4xl">chuckit.xyz</h1>
      <p className="text-4xl">✅</p>
      <h1 className="text-xl">You have been authenticated!</h1>
      <a href="/" className="underline">
        redirecting to home
      </a>
    </main>
  );
};

export default VerifyPage;
