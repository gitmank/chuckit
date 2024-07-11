"use client";
import React from "react";
import PopUp from "@/components/small/PopUp";
import SignupForm from "@/components/auth/SignupForm";
import LoginForm from "@/components/auth/LoginForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPanel() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center py-8 md:border-l-2 p-4">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">free account</h1>
      </div>
      <p className="text-balance text-foreground text-center">
        we don't want your identity, 100% anonymous
      </p>
      {/* <Tabs defaultValue="signup" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">signup</TabsTrigger>
          <TabsTrigger value="login">login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <SignupForm />
        </TabsContent>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
      </Tabs> */}
      <div className="mt-4 text-center text-base">
        <p className="text-balance text-foreground bg-green-500 mb-4 px-1 text-sm md:text-base">
          4x limits, custom links, 100% secure
        </p>
        <ExtrasPopUp />
      </div>
    </div>
  );
}

const ExtrasPopUp = () => {
  return (
    <PopUp
      openButtonText={"💙 see what's coming"}
      title={"1M expiry, 80MB limit, 100 downloads 💚"}
      closeButtonText={"Let's do it!"}
    >
      <div className="flex flex-col w-full h-full gap-4 py-2">
        <div>
          <p className="text-blue-400 text-base font-bold text-left">
            🔗 Shortlinks (coming soon)
          </p>
          <p className="text-left">
            own 5 memorable custom links, assign them to any file
          </p>
        </div>
        <div>
          <p className="text-blue-400 text-base font-bold text-left">
            🔐 Access Control (coming soon)
          </p>
          <p className="text-left">
            share files with specific users and track access
          </p>
        </div>
        <div>
          <p className="text-blue-400 text-base font-bold text-left">
            🛜 Nearby Share (coming soon)
          </p>
          <p className="text-left">directly drop a file to nearby users</p>
        </div>
      </div>
    </PopUp>
  );
};
