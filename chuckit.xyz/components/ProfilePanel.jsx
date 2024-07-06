"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function ProfilePanel({ user }) {
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/protected/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-email": user?.email,
        },
        body: JSON.stringify({ csrf_username: user?.username }),
      });
      if (res.status === 200) {
        window.location.reload();
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error("POST /logout error");
      alert("Failed to logout.");
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center py-8 border-l-2 p-4">
      <div className="grid gap-4 text-center">
        <h1 className="text-3xl font-bold">hi, {user.username}</h1>
        <p className="text-balance text-foreground text-center">
          we're working on special features for you
        </p>
        <p className="text-sm">
          last login: {new Date(user.lastLogin).toLocaleString("en-in")}
        </p>
      </div>
      <Button
        onClick={handleLogout}
        className="bg-red-200 text-red-500 hover:bg-red-500 hover:text-white"
      >
        logout
      </Button>
    </div>
  );
}
