import React from "react";

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
        {type !== "pdf" ? <></> : ""}
      </div>
    );
  }
  return <div>FileUpload</div>;
}

export default FileUpload;
