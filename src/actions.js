"use server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function removeBgCloud(base64) {
  // Step 1: Upload base64 image to Cloudinary
  const uploadResult = await cloudinary.v2.uploader.upload(base64, {
    folder: "bg-removal",
  });

  // Step 2: Return transformed URL with background removed
  const bgRemovedUrl = cloudinary.v2.url(uploadResult.public_id, {
    transformation: [{ effect: "background_removal" }, { format: "png" }],
  });

  // Step 3: Fetch image and convert to Blob
  const res = await fetch(bgRemovedUrl);
  if (!res.ok) throw new Error("Failed to fetch background-removed image");

  const arrayBuffer = await res.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "image/png" });

  return blob;
}

export async function removeBg(base64Image) {
  if (!process.env.RMBG_API_KEY) {
    throw new Error("Remove.bg API key is missing.");
  }

  const base64 = base64Image.includes(",")
    ? base64Image.split(",")[1]
    : base64Image;

  const formData = new FormData();
  formData.append("image_file_b64", base64);
  formData.append("size", "auto");

  const res = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": process.env.RMBG_API_KEY,
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Remove.bg API Error:", errText);
    throw new Error(errText);
  }

  if (res.status === 402) {
    return await removeBgCloud(base64Image);
  }

  const arrayBuffer = await res.arrayBuffer();
  return new Blob([arrayBuffer], { type: "image/png" });
}
