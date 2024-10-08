"use client";
import { useState, useEffect } from "react";

const KEY = "upvotes";

export default function UpvotePanel() {
  const [upvotes, setUpvotes] = useState(0);
  const [voted, setVoted] = useState(0);

  useEffect(() => {
    const fetchUpvotes = async () => {
      const res = await fetch(`/api/public/upvote?key=${KEY}`);
      const data = await res.json();
      setUpvotes(data.upvotes);
    };

    fetchUpvotes();
  }, []);

  useEffect(() => {
    if (!window) return;
    const voted = localStorage?.getItem(KEY) || 0;
    setVoted(voted);
  }, []);

  const handleUpvote = async () => {
    if (voted) {
      alert("You have already upvoted this idea");
      return;
    } else {
      setVoted(true);
      localStorage?.setItem(KEY, 1);
    }
    const res = await fetch(`/api/public/upvote?key=${KEY}`, {
      method: "POST",
    });
    const data = await res.json();
    setUpvotes(data.upvotes);
  };

  return (
    <div className="flex flex-col justify-center items-center text-center gap-4">
      <button
        onClick={handleUpvote}
        className="text-base animate-pulse font-bold bg-blue-500 text-white p-1 rounded-md"
      >
        🔼 upvote
      </button>
      <h2 className="text-xl font-bold text-blue-400">
        {upvotes || "many"} others liked this idea
      </h2>
    </div>
  );
}
