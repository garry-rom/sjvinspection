import React, { useRef } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';

type Props = {
  label: string;
  required?: boolean;
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
};

export function FileUpload({ label, required, file, onChange, accept = 'image/*' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onChange(selectedFile);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition"
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Click to upload</p>
          <p className="text-xs text-gray-400 mt-1">
            {accept === 'application/pdf' ? 'PDF files only' : 'Image files only'}
          </p>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <FileIcon className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        required={required && !file}
      />
    </div>
  );
}
