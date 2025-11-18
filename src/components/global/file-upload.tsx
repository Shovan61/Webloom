"use client";

import React from "react";
import Image from "next/image";
import { FileIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

type Props = {
  apiEndPoint: "agencylogo" | "avatar" | "subaccountLogo";
  onChange: (url?: string) => void;
  value?: string;
};

function FileUpload({ apiEndPoint, onChange, value }: Props) {
  const type = value?.split(".").pop();

  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {type !== "pdf" ? (
          <div className="relative w-40 h-40">
            <Image
              src={value}
              fill
              className="object-contain"
              alt="uploaded image"
            />
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              View PDF
            </a>
          </div>
        )}
        <Button onClick={() => onChange("")} variant={"outline"} className="border-dotted cursor-pointer" type="button">
          <X className="h-4 w-4" /> Remove Logo
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full bg-muted/30 ">
      <UploadDropzone
        endpoint={"imageUploader"}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].ufsUrl);
        }}
        onUploadError={(error: Error) => {
          console.log(error);
          toast.error("Something went wrong!");
        }}
      />
    </div>
  );
}

export default FileUpload;
