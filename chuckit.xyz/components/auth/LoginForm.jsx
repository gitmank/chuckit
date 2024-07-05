"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

export default function LoginForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = async () => {
    setError(null);
    if (loading) return;
    setLoading(true);
    // validate form
    const email = document.getElementById("email").value;
    const isValid = await validateEmail(email);
    if (!isValid) {
      setLoading(false);
      return;
    }
    // send email
    await sendMail(email);
  };

  const sendMail = async (email) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (res.status === 200) {
        setError(null);
        setLoading(false);
        setSuccess(true);
      } else {
        setError("error sending email");
        setLoading(false);
      }
    } catch (error) {
      console.error("POST /email error");
      setError("error sending email");
      setLoading(false);
    }
  };

  const validateEmail = async (email) => {
    if (!email) {
      setError("missing fields");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("invalid email");
      return false;
    }
    return true;
  };

  if (success)
    return (
      <Card className="w-full max-w-sm pt-8">
        <CardContent className="grid gap-4">
          <CardTitle className="mx-auto">Success</CardTitle>
          <p className="text-green-500 mx-auto text-sm text-center">
            if an account with that email exists, a verification email must have
            been sent
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
        <p className="text-red-500 mx-auto text-sm">{error}</p>
      </CardContent>
      <CardFooter className="gap-4">
        <Button onClick={handleLogin} className="w-full text-white">
          {loading ? "loading..." : "login"}
        </Button>
      </CardFooter>
    </Card>
  );
}
