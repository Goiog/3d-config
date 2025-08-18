import React, { useContext, useEffect, useRef, useState } from "react";
import ColorPicker from "react-best-gradient-color-picker";
import { ContextTool } from "../Mainstate(tool)/Mainstatetool";
import { randomSvg } from "@/Consonats";

const ColorEdit = () => {
  const { changeColor, smScreen } = useContext(ContextTool);
  const [pikercolor, setpikercolor] = useState("#f20202ff");
  const dialogRef = useRef(null);
  const [smSCP, setsmSCP] = useState(null);

  useEffect(() => {
    setsmSCP(
      smScreen
        ? dialogRef.current.clientWidth - 20
        : dialogRef.current.clientWidth
    );
  }, [smScreen]);

  return (
    <div
      ref={dialogRef}
      className="w-full md:py-[30px] md:relative  md:bottom-0 left-0 py-[10px] px-[10px] md:px-[0]"
    >
      <span className="font-medium text-[16px] text-white">Color :</span>
      {smSCP && (
        <ColorPicker
          value={pikercolor}
          onChange={(e) => {
            setpikercolor(e);
            changeColor(e);
          }}
          height={120}
          width={smSCP}
          hideColorGuide
          hideInputType
          hideColorTypeBtns
          hideInputs={smScreen}
          hideOpacity={smScreen}
          className={"!bg-dialog-color w-full mt-[5px]"}
        />
      )}

      <div className="flex flex-col md:mt-[15px] mt-[10px]">
        <span className="font-medium text-[16px] text-white">
          Generate Random Color :
        </span>
        <div className="md:mt-[10px] mt-[5px]">
          <button
            onClick={() => {
              const randomColor =
                "#" +
                Math.floor(Math.random() * 16777215)
                  .toString(16)
                  .padStart(6, "0");
              setpikercolor(randomColor);
              changeColor(randomColor);
            }}
            className="flex flex-row bg-blue-400 w-[120px] rounded-[12px] h-[40px] flex-center cursor-pointer active:opacity-75 gap-[5px]"
          >
            {randomSvg}
            Random
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorEdit;
