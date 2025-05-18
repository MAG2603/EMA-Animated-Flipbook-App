
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePDF } from "@/hooks/usePDF";
import { toast } from "sonner";

interface PDFUploadProps {
  onFileLoad: (file: File) => void;
}

export const PDFUpload = ({ onFileLoad }: PDFUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndLoadFile(file);
    }
  };

  const validateAndLoadFile = (file: File) => {
    // Check if it's a PDF
    if (file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file.");
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    onFileLoad(file);
    toast.success(`${file.name} loaded successfully!`);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      validateAndLoadFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-border"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
      />

      <div className="mb-4">
        <img
          src="/lovable-uploads/765fbca0-bc8e-4eae-b6ea-75503433f8c2.png"
          alt="EMA Mascot"
          className="w-16 h-16 rounded-full object-cover border-2 border-primary mb-2"
        />
      </div>

      <div className="text-center mb-4">
        <h3 className="font-medium text-lg mb-1">Upload your PDF</h3>
        <p className="text-muted-foreground text-sm">
          Drag & drop your PDF file here, or click to browse
        </p>
      </div>

      <Button onClick={handleButtonClick} className="min-w-32">
        Choose PDF
      </Button>
    </div>
  );
};
