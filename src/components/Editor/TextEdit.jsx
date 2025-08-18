import React, { useContext, useRef } from "react";
import { ContextTool } from "../Mainstate(tool)/Mainstatetool";
import { prods, textPositions, trash } from "@/Consonats";
import notificationCaller from "../NotificationCaller";
import { toast } from "react-toastify";

const TextEdit = ({}) => {
  const {
    addTextLayer,
    UpdateText,
    selectedText,
    setselectedText,
    textsCanvas,
    canvas,
    setTextsCanvas,
  } = useContext(ContextTool);
  const inputRef = useRef(null);

  const CheckSelectedLayer = (func) => {
    if (!canvas.getActiveObject()) {
      if (!toast.isActive("select-layer-notification")) {
        notificationCaller(false, "Please Select a layer!!!", (msg) =>
          toast(msg, { toastId: "select-layer-notification" })
        );
      }
    } else {
      func();
    }
  };

  return (
    <div className="flex flex-col md:gap-[25px] gap-[10px] w-full md:py-[30px] py-[10px] ">
      <div>
        <span className="font-medium text-[16px] text-white">Add Text :</span>
        <input
          ref={inputRef}
          className="w-full h-[46px] px-[12px] border border-gray-400 rounded-xl mt-[10px] outline-none text-textLight"
        />
        <button
          onClick={() => {
            if (inputRef.current.value === "") {
              notificationCaller(
                false,
                "Text cannot be empty. Please enter some text.",
                toast
              );
              inputRef.current.focus();
            } else {
              addTextLayer(inputRef.current.value);
            }
          }}
          className="flex-center relative  bg-white px-3 py-2 text-[14px] font-[700] h-[45px] w-full gap-[10px] rounded-[10px] mt-[10px] cursor-pointer active:translate-y-[2px]"
        >
          Add Text Layer
        </button>
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-[16px] text-white">
          Text Positions
        </span>
        <div className="flex flex-row gap-[10px] mt-[12px]">
          <div className="flex flex-col gap-[2px] flex-center w-full">
            <span className="font-medium text-[14px] text-white">
              X Positions
            </span>
            <input
              type="range"
              className="w-full"
              max={100}
              min={-100}
              onInput={(e) => {
                CheckSelectedLayer(() => {
                  const newValue = parseInt(e.target.value);
                  const diff = newValue - (selectedText.prevLeftValue || 0);
                  const val = selectedText.left + diff;
                  setselectedText((prev) => ({
                    ...prev,
                    prevLeftValue: newValue,
                  }));

                  setselectedText((prev) => ({
                    ...prev,
                    left: val,
                  }));
                  UpdateText(undefined, undefined, val);
                });
              }}
            />
          </div>
          <div className="flex flex-col gap-[2px] flex-center w-full">
            <span className="font-medium text-[14px] text-white">
              Y Positions
            </span>
            <input
              type="range"
              className="w-full"
              max={150}
              min={-150}
              onInput={(e) => {
                CheckSelectedLayer(() => {
                  const newValue = parseInt(e.target.value);
                  const diff = newValue - (selectedText.prevTopValue || 0);
                  const val = selectedText.top + diff;
                  setselectedText((prev) => ({
                    ...prev,
                    prevTopValue: newValue,
                  }));
                  setselectedText((prev) => ({
                    ...prev,
                    top: val,
                  }));
                  UpdateText(undefined, val, undefined);
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-[16px] text-white">Font Size</span>
        <div className="flex flex-row gap-[10px] mt-[5px]">
          <input
            type="number"
            className="w-full bg-canvasColor h-[45px] rounded-[12px] text-white outline-none px-[14px]"
            max={6}
            min={1}
            onInput={(e) => {
              CheckSelectedLayer(() => {
                const val = e.target.value;
                setselectedText((prev) => ({
                  ...prev,
                  fontSize: val,
                }));
                UpdateText(undefined, undefined, undefined, val);
              });
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        {textsCanvas.map((it, index) => (
          <div
            key={index}
            className="w-full flex flex-row px-[10px] py-[15px] h-[46px] justify-between items-center rounded-[12px] border border-gray-500"
          >
            <div className="flex flex-row gap-2 items-center">
              <span className="[&_svg]:w-4 [&_svg]:h-4">{prods[1].svg}</span>
              <p className="text-[16px] font-medium text-white">{it.text}</p>
            </div>
            <button
              onClick={() => {
                canvas.remove(it);
                setTextsCanvas((e) => {
                  const prev = [...e];
                  prev.splice(index, 1);
                  return [...prev];
                });
              }}
              className="w-10 h-10 flex-center cursor-pointer active:opacity-40"
            >
              {trash}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextEdit;
