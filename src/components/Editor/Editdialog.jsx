import { cross, prods } from "@/Consonats";
import React, { useState } from "react";
import ColorEdit from "./ColorEdit";
import TextEdit from "./TextEdit";
import ImageEdit from "./ImageEdit";
import ExportEdit from "./ExportEdit";

const Editdialog = ({ threeCanvas }) => {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div
      id="scroll-none"
      className="flex flex-col absolute bottom-[0dvh] w-[100vw] h-[45px] md:h-max md:top-[30px] md:left-[40px] bg-dialog-color z-[5000] md:w-[max(20vw,350px)] md:min-h-[500px] md:max-h-[90vh] rounded-2xl md:border md:border-gray-500 shadow-2xl  px-[15px] md:overflow-y-scroll"
    >
      <TopBar setCurrentPage={setCurrentPage} currentPage={currentPage} />
      <div className="absolute bottom-[40px] w-full max-h-[46vh] md:max-h-max left-0 md:relative md:bottom-0 bg-[#323A44] rounded-t-[20px] md:px-[0] px-[10px] overflow-y-scroll md:overflow-visible">
        <button
          className="w-[20px] h-[20px] absolute right-[20px] top-[10px] md:hidden flex bg-white rounded-full"
          onClick={() => setCurrentPage(12)}
        >
          {cross}
        </button>
        {currentPage === 0 && <ColorEdit />}
        {currentPage === 1 && <TextEdit />}
        {currentPage === 2 && <ImageEdit />}
        {currentPage === 3 && <ExportEdit threeCanvas={threeCanvas} />}
      </div>
    </div>
  );
};

export default Editdialog;

const TopBar = ({ setCurrentPage, currentPage }) => {
  return (
    <div className="w-full h-[25px] pt-[30px] flex flex-row justify-between items-center sticky top-[0px] bg-dialog-color z-[20]">
      {prods.map((it, index) => (
        <button
          onClick={() => setCurrentPage(index)}
          key={index}
          className={`text-[16px] font-bold text-gray-700 flex-center flex-col border-b border-transparent flex-1 pb-[12px] cursor-pointer bg-dialog-color ${
            currentPage === index
              ? "!border-b-[4px] !border-[#bdc7d1]"
              : "!border-gray-600"
          }`}
        >
          <span className="[&_svg]:stroke-[#bdc7d1]">{it.svg}</span>
          {/* {it.text} */}
        </button>
      ))}
    </div>
  );
};
