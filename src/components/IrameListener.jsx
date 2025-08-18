"use client";

import { useEffect } from "react";

export default function IframeListener() {
  useEffect(() => {
    function handleMessage(event) {
      if (event.origin !== "http://localhost:3000") {
        // You can also use "*" for local dev, but be careful in production
        console.warn("Invalid origin:", event.origin);
        return;
      }

      const { type, payload } = event.data;

      console.log("Received postMessage:", type, payload);

      // Handle the messages
      if (type === "add-text") {
        // Add the text to your canvas/scene
      }
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return null; // or whatever JSX you want
}
