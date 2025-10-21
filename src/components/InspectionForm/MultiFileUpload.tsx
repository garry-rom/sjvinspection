import React, { useRef } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';

type Props = {
  label: string;
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles: number;
  accept?: string;
};

export function MultiFileUpload({ label, files, onChange, maxFiles, accept = 'image/*' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const remainingSlots = maxFiles - files.length;
    const filesToAdd = selectedFiles.slice(0, remainingSlots);

    if (filesToAdd.length > 0) {
      onChange([...files, ...filesToAdd]);
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const canAddMore = files.length < maxFiles;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} (Max {maxFiles})
      </label>

      <div className="space-y-3">
        {files.map((file, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-3 flex items-center justify-between bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <FileIcon className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-gray-400 hover:text-red-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}

        {canAddMore && (
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition"
          >
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Add file ({files.length}/{maxFiles})
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
    </div>
  );
}
