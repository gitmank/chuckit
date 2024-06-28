import React from "react";

const NotFoundPage = () => {
  return (
    <main className="flex flex-col justify-center items-center text-center w-full h-screen gap-8 bg-black text-white">
      <h1 className="text-4xl">chuckit.xyz</h1>
      <p className="text-4xl">🚫</p>
      <h1 className="text-xl">Something broke :/</h1>
      <a href="/" className="underline">
        Return Home
      </a>
    </main>
  );
};

export default NotFoundPage;
