"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUpload({ images, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList) {
    setError("");
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) { setError("Only image files are allowed."); continue; }
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        uploaded.push(url);
      } else {
        setError("Upload failed. Please try again.");
      }
    }
    onChange([...images, ...uploaded]);
    setUploading(false);
  }

  function remove(url: string) {
    onChange(images.filter((i) => i !== url));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((url, idx) => (
          <div key={url} className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#E2DDD7] group">
            <Image src={url} alt={`Product image ${idx + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute top-1 right-1 bg-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
            >
              <X size={12} className="text-red-500" />
            </button>
            {idx === 0 && (
              <span className="absolute bottom-1 left-1 bg-[#3D4A1E] text-white text-[9px] px-1.5 py-0.5 rounded font-semibold">Main</span>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 rounded-xl border-2 border-dashed border-[#E2DDD7] flex flex-col items-center justify-center gap-1.5 hover:border-[#3D4A1E] hover:bg-[#FAF8F5] transition-colors text-[#6B6B6B] disabled:opacity-50"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          <span className="text-[10px] font-medium">{uploading ? "Uploading…" : "Add photo"}</span>
        </button>
      </div>

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      <p className="text-xs text-[#6B6B6B]">First image is the main photo.</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
}
