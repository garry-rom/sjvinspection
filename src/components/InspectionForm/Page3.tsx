import React from 'react';
import { InspectionFormData } from './types';
import { FileUpload } from './FileUpload';
import { MultiFileUpload } from './MultiFileUpload';

type Props = {
  formData: InspectionFormData;
  onChange: (data: Partial<InspectionFormData>) => void;
};

export function Page3({ formData, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">VDR EPIRB Report</h2>

        <FileUpload
          label="Attach PDF or Photo"
          required
          file={formData.epirbReport}
          onChange={(file) => onChange({ epirbReport: file })}
          accept="image/*,application/pdf"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Maker Report</h2>

        <FileUpload
          label="Attach PDF from Files"
          required
          file={formData.makerReport}
          onChange={(file) => onChange({ makerReport: file })}
          accept="application/pdf"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Class Report</h2>

        <div className="space-y-6">
          <FileUpload
            label="Attach PDF from Files"
            file={formData.classReport}
            onChange={(file) => onChange({ classReport: file })}
            accept="application/pdf"
          />

          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-2">
              If Non-Approved Class, Mention the Class
            </label>
            <input
              id="className"
              type="text"
              value={formData.className}
              onChange={(e) => onChange({ className: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              placeholder="Enter class name if applicable"
            />
          </div>

          <p className="text-xs text-gray-500">
            Note: Either upload a class report or specify the class name if non-approved
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Previous Year COC</h2>

        <MultiFileUpload
          label="Attach Photos"
          files={formData.previousCoc}
          onChange={(files) => onChange({ previousCoc: files })}
          maxFiles={2}
          accept="image/*"
        />
      </div>
    </div>
  );
}
