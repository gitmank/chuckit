"use client";

import React from "react";
import { useState } from "react";

export default function CopyLink({ link }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <p
      onClick={handleCopyLink}
      className="bg-gray-600 text-sm lg:text-base font-mono text-white p-1 w-max px-2 rounded-md shadow-blue-500 shadow-lg duration-100 hover:scale-105 active:scale-95"
    >
      {copied ? "✅ " : "📋 "} {link.split("://").pop()}
    </p>
  );
}
