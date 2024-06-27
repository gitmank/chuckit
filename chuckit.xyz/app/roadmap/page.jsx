"use client";
import React, { useEffect, useState } from "react";

const KEY = "features";

const FEATURES = {
  "click to upload": 0,
  "customize links": 0,
  "preview files": 0,
  "nearby sharing": 0,
  "share folders": 0,
  "passcode protection": 0,
};

const RoadmapPage = () => {
  const [features, setFeatures] = useState(FEATURES);

  const fetchUpvotes = async () => {
    try {
      const res = await fetch(`/api/public/upvote?key=${KEY}`);
      const data = await res.json();
      const upvotes = JSON.parse(data.upvotes) || FEATURES;
      setFeatures(upvotes);
    } catch (error) {
      console.error("GET /upvote error");
    }
  };

  useEffect(() => {
    fetchUpvotes();
  }, []);

  const updateVotes = async (upvotes) => {
    try {
      const res = await fetch(`/api/public/upvote?key=${KEY}`, {
        method: "PUT",
        body: JSON.stringify({ upvotes: JSON.stringify(upvotes) }),
      });
      if (res.ok) {
        setFeatures(upvotes);
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error("POST /upvote error", error);
      alert("Failed to upvote feature.");
    }
  };

  const handleVote = async (id) => {
    try {
      // update state
      const newVotes = {
        ...features,
        [id]: features[id] + 1,
      };
      updateVotes(newVotes);
    } catch (error) {
      console.error("POST /upvote error", error);
    }
  };

  return (
    <main className="container mx-auto lg:w-2/3 p-4 flex flex-col justify-center gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2 mt-4">Feature Roadmap</h1>
        <p className="text-base mb-4">upvote features you want most</p>
      </div>
      <ul className="space-y-8 text-lg">
        {Object.keys(FEATURES).map((feature, index) => (
          <li
            key={index}
            className="flex items-center border-b-[1px] border-dashed border-white py-2"
          >
            <button className="mr-2" onClick={() => handleVote(feature)}>
              🔼&nbsp;&nbsp;{feature}
            </button>
            <span className="ml-auto">{features[feature]}</span>
          </li>
        ))}
      </ul>
      <a className="w-full text-center text-lg underline" href="/">
        Return Home
      </a>
    </main>
  );
};

export default RoadmapPage;
