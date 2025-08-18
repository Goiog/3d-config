import { uploadsvg } from "@/Consonats";
import React, { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ContextTool } from "../Mainstate(tool)/Mainstatetool";
import notificationCaller from "../NotificationCaller";
import Image from "next/image";
import { trash } from "@/Consonats";

const ImageEdit = () => {
  const {
    addImageLayer,
    imagesDisplayed,
    setimagesDisplayed,
    canvas,
    smScreen,
  } = useContext(ContextTool);
  const fileinput = useRef(null);

  return (
    <div className="flex flex-col md:gap-[25px] gap-[10px] w-full md:py-[30px] py-[10px] ">
      <div className="w-full">
        <span className="font-medium text-[16px] text-white">
          Upload Image :
        </span>

        <input
          ref={fileinput}
          type="file"
          accept="image/png, image/webp, image/jpeg, image/jpeg"
          className="hidden"
          onInput={async (e) => {
            const allowedFileTypes = [
              "image/png",
              "image/jpeg",
              "image/jpg",
              "image/webp",
            ];
            if (
              e.target.files[0] &&
              allowedFileTypes.includes(e.target.files[0].type)
            ) {
              const Url = URL.createObjectURL(e.target.files[0]);
              setimagesDisplayed((e) => [...e, Url]);
              addImageLayer(Url, Url);
              notificationCaller(true, "Image Added", toast);
            } else {
              notificationCaller(false, "Please upload an image file.", toast);
            }
          }}
        />
        <button
          onClick={() => {
            fileinput.current.click();
          }}
          className="flex-center relative  bg-white px-3 py-2 text-[14px] font-[700] h-[45px] w-full gap-[10px] rounded-[10px] mt-[10px] cursor-pointer"
        >
          <span className="translate-y-[-2px]">{uploadsvg}</span>
          Upload Image
        </button>
      </div>
      <div className="flex-row flex-wrap flex gap-[10px]">
        {imagesDisplayed.map((it, index) => (
          <span className="relative" key={index}>
            <button
              onClick={() => {
                canvas.remove(
                  canvas.getObjects().find((ele) => ele.url === it)
                );
                setimagesDisplayed((e) => {
                  return e.filter((ele) => ele !== it);
                });
              }}
              className="absolute top-[10px] right-[10px] w-[30px] h-[30px] bg-canvasColor rounded-[10px] flex-center cursor-pointer"
            >
              {trash}
            </button>
            <Image
              src={it}
              key={index}
              quality={100}
              width={500}
              height={500}
              className="md:w-[100%] h-auto rounded-[10px] border border-gray-600 shadow-2xl w-[25%]"
              alt={"uploaded-image" + index + 1}
            />
          </span>
        ))}
      </div>
    </div>
  );
};

export default ImageEdit;
