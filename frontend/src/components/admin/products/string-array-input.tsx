import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ImagesInputProps {
  images: string[];
  setImages: (images: string[]) => void;
}

function ImagesInput({ images, setImages }: ImagesInputProps) {
  const [url, setUrl] = useState("");

  const addImage = () => {
    if (!url.trim()) return;
    setImages([...images, url.trim()]);
    setUrl("");
  };

  const removeImage = (img: string) => {
    setImages(images.filter((i) => i !== img));
  };

  return (
    <div className="space-y-3">
      {images.map((img, idx) => (
        <div key={idx} className="flex gap-3 items-center">
          <Input className="text-[0.85rem] md:text-[0.9rem]" value={img} readOnly />
          <Button variant="destructive" onClick={() => removeImage(img)}>
            X
          </Button>
        </div>
      ))}

      <div className="flex gap-2">
        <Input
          className="text-[0.85rem] md:text-[0.9rem]"
          value={url}
          placeholder="Nhập URL ảnh"
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button 
          onClick={addImage}
          className="bg-green-500 text-[0.85rem] md:text-[0.9rem] font-medium text-base text-white hover:bg-green-600"
        >
          Thêm ảnh
        </Button>
      </div>
    </div>
  );
}

interface TagsInputProps {
  values: string[];
  setValues: (values: string[]) => void;
}

function TagsInput({ values, setValues } : TagsInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    if (!input.trim()) return;
    setValues([...values, input.trim()]);
    setInput("");
  };

  const removeTag = (tag: string) => {
    setValues(values.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {values.map((tag, idx) => (
          <div key={idx} className="px-2 py-1 text-[0.8rem] md:text-[0.9rem] bg-[#EBF2F5] rounded flex items-center gap-2">
            <span>{tag}</span>
            <button onClick={() => removeTag(tag)} className="text-black">×</button>
          </div>
        ))}
      </div>  

      <div className="flex gap-2">
        <input
          className="input-pro h-9"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tag rồi nhấn Enter"
          onKeyDown={(e) => e.key === "Enter" && addTag()}
        />
        <Button 
          onClick={addTag}
          className="bg-green-500 font-medium text-[0.85rem] md:text-[0.9rem] text-white hover:bg-green-600"
          >
            Thêm
          </Button>
      </div>
    </div>
  );
}


export {ImagesInput, TagsInput}
