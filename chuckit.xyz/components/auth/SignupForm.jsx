"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

export default function SignupForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    setError(null);
    if (loading) return;
    setLoading(true);
    // validate form
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const isValid = await validateFields(email, username);
    if (!isValid) {
      setLoading(false);
      return;
    }
    // send email
    await sendMail(email, username);
  };

  const sendMail = async (email, username) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username }),
      });
      if (res.status === 200) {
        setError(null);
        setLoading(false);
        setSuccess(true);
      } else {
        setError("error creating account");
        setLoading(false);
      }
    } catch (error) {
      console.error("POST /email error");
      setError("error sending email");
      setLoading(false);
    }
  };

  const validateFields = async (email, username) => {
    if (!email || !username) {
      setError("missing fields");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("invalid email");
      return false;
    }
    if (username.length < 5) {
      setError("username too short");
      return false;
    }
    try {
      const response = await fetch(`/api/auth/username?username=${username}`);
      if (response.status !== 200) {
        setError("username taken");
        return false;
      }
      return true;
    } catch (error) {
      console.error("error validating username");
      setError("error validating username");
      return false;
    }
  };

  if (success)
    return (
      <Card className="w-full max-w-sm pt-8">
        <CardContent className="grid gap-4">
          <CardTitle className="mx-auto">Success</CardTitle>
          <p className="text-green-500 mx-auto text-sm">
            please check your email for a verification link
          </p>
        </CardContent>
      </Card>
    );

  return (
    <Card className="w-full max-w-sm pt-8">
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="god@arrakis.com"
            autoComplete="email"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">username (min 5)</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="leto2"
            autoComplete="username webauthn"
          />
        </div>
        <p className="text-red-500 mx-auto text-sm">{error}</p>
      </CardContent>
      <CardFooter className="gap-4">
        <Button onClick={handleSignup} className="w-full text-white">
          {loading ? "loading..." : "signup"}
        </Button>
      </CardFooter>
    </Card>
  );
}
