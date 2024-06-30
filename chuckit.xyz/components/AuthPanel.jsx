"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthPanel() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center py-8 border-l-2 p-4">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">free account</h1>
      </div>
      <p className="text-balance text-foreground text-center">
        we don't want your identity, 100% anonymous
      </p>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">login or signup</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">nickname</Label>
            <Input id="nickname" type="text" placeholder="leto2" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">password</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="gap-4">
          <Button className="w-full text-white">login</Button>
          <Button className="w-full text-white">signup</Button>
        </CardFooter>
      </Card>
      <div className="mt-4 text-center text-base">
        <p className="text-balance text-foreground bg-green-500 mb-4 px-1 text-sm md:text-base">
          4x limits, custom links, 100% secure
        </p>
      </div>
    </div>
  );
}
