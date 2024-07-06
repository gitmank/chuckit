"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PopUp({
  openButtonText,
  title,
  children,
  closeButtonText,
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="rounded-full text-xs p-1 px-3" variant="outline">
          {openButtonText || "Open"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-11/12 rounded-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {children}
          <AlertDialogDescription className="sr-only">
            your files are end-to-end encrypted
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="text-white">
            {closeButtonText || "Close"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
