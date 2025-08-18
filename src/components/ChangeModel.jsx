"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ChangeModel = ({ selectedModel }) => {
  const params = useSearchParams();
  const router = useRouter();
  const models = [
    { label: "Shirt", value: "Shirt" },
    { label: "Mug", value: "Mug" },
    { label: "Cap", value: "Cap" },
    { label: "Poster", value: "Poster" },
  ];

  useEffect(() => {
    const mod = params.get("model");
    mod && (selectedModel.current = mod);
  }, [params]);

  return (
    <div className="max-w-[200px] w-full rounded absolute top-[20px] right-[20px] hidden">
      <select
        className="w-full p-1 border border-gray-400 rounded text-white px-[10px]"
        value={selectedModel.current}
        onChange={(e) => {
          window.location.href = "?model=" + e.target.value;
        }}
      >
        {models.map((model) => (
          <option
            key={model.value}
            value={model.value}
            className="text-white bg-black"
          >
            {model.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChangeModel;
