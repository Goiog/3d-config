import React, { useContext, useState } from "react";
import { ContextTool } from "../Mainstate(tool)/Mainstatetool";
import { useThree } from "@react-three/fiber";
import notificationCaller from "../NotificationCaller";
import { toast } from "react-toastify";

const ExportEdit = ({ threeCanvas }) => {
  const { animatedCanvas, setanimatedCanvas } = useContext(ContextTool);

  return (
    <div className="flex flex-col md:gap-[25px] gap-[10px] w-full md:py-[30px] py-[10px]">
      <div className="w-full">
        <span className="font-medium text-[16px] text-white">Animation :</span>
        <div className="mt-[10px] w-full">
          <button
            onClick={() => setanimatedCanvas(!animatedCanvas)}
            className="flex flex-row bg-blue-400 w-full rounded-[12px] h-[40px] flex-center cursor-pointer active:opacity-75 gap-[5px]"
          >
            {animatedCanvas ? "Stop" : "Start"} Animation
          </button>
        </div>
      </div>
      <div className="w-full">
        <span className="font-medium text-[16px] text-white">
          Export (png) :
        </span>
        <div className="mt-[10px] w-full">
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = threeCanvas.current.toDataURL("image/png");
              link.download = "screenshot.png";
              link.click();
              notificationCaller(true, "File downloaded...", toast);
            }}
            className="flex flex-row bg-blue-400 w-full rounded-[12px] h-[40px] flex-center cursor-pointer active:opacity-75 gap-[5px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 17 24"
              fill="none"
              stroke="#000000"
            >
              <path
                d="M17 11.667V15.2225C17 15.694 16.8127 16.1462 16.4793 16.4796C16.1459 16.813 15.6937 17.0003 15.2222 17.0003H2.77778C2.30628 17.0003 1.8541 16.813 1.5207 16.4796C1.1873 16.1462 1 15.694 1 15.2225V11.667"
                stroke="inherit"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.4436 5.44444L8.99913 1L4.55469 5.44444"
                stroke="inherit"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 1V11.6667"
                stroke="inherit"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportEdit;
