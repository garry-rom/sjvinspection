import React from 'react';
import { InspectionFormData } from './types';
import { FileUpload } from './FileUpload';
import { MultiFileUpload } from './MultiFileUpload';

type Props = {
  formData: InspectionFormData;
  onChange: (data: Partial<InspectionFormData>) => void;
};

export function Page2({ formData, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">DAU Photo</h2>

        <div className="space-y-6">
          <FileUpload
            label="DAU Door Open"
            required
            file={formData.dauDoorOpen}
            onChange={(file) => onChange({ dauDoorOpen: file })}
          />

          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Serial Number <span className="text-red-500">*</span>
            </label>
            <input
              id="serialNumber"
              type="text"
              value={formData.serialNumber}
              onChange={(e) => onChange({ serialNumber: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              placeholder="Enter serial number"
            />
          </div>

          <FileUpload
            label="Grounding"
            required
            file={formData.grounding}
            onChange={(file) => onChange({ grounding: file })}
          />

          <FileUpload
            label="VDR Backup Battery Photo with Expiry Date"
            required
            file={formData.batteryPhoto}
            onChange={(file) => onChange({ batteryPhoto: file })}
          />

          <MultiFileUpload
            label="Optional Photos"
            files={formData.dauOptional}
            onChange={(files) => onChange({ dauOptional: files })}
            maxFiles={3}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Fixed Capsule</h2>

        <div className="space-y-6">
          <FileUpload
            label="Fixed Capsule"
            required
            file={formData.capsulePhoto}
            onChange={(file) => onChange({ capsulePhoto: file })}
          />

          <FileUpload
            label="Cable Gland and Cable"
            required
            file={formData.cableGland}
            onChange={(file) => onChange({ cableGland: file })}
          />

          <FileUpload
            label="Beacon with Expiry Date"
            required
            file={formData.beaconExpiry}
            onChange={(file) => onChange({ beaconExpiry: file })}
          />

          <MultiFileUpload
            label="Optional Photos"
            files={formData.capsuleOptional}
            onChange={(files) => onChange({ capsuleOptional: files })}
            maxFiles={3}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Float Free</h2>

        <div className="space-y-6">
          <FileUpload
            label="Float Free"
            required
            file={formData.floatFree}
            onChange={(file) => onChange({ floatFree: file })}
          />

          <FileUpload
            label="Cover Removed"
            required
            file={formData.coverRemoved}
            onChange={(file) => onChange({ coverRemoved: file })}
          />

          <FileUpload
            label="Junction Box"
            required
            file={formData.junctionBox}
            onChange={(file) => onChange({ junctionBox: file })}
          />

          <FileUpload
            label="HRU"
            required
            file={formData.hru}
            onChange={(file) => onChange({ hru: file })}
          />

          <MultiFileUpload
            label="Optional Photos"
            files={formData.floatOptional}
            onChange={(files) => onChange({ floatOptional: files })}
            maxFiles={3}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">BCP - Display Unit</h2>

        <div className="space-y-6">
          <FileUpload
            label="BCP Display Photo Without Any Error"
            required
            file={formData.bcpDisplay}
            onChange={(file) => onChange({ bcpDisplay: file })}
          />

          <MultiFileUpload
            label="Optional Photos"
            files={formData.bcpOptional}
            onChange={(files) => onChange({ bcpOptional: files })}
            maxFiles={3}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Video Interface Unit</h2>

        <div className="space-y-6">
          <FileUpload
            label="Video Interface Unit 1"
            required
            file={formData.videoUnit1}
            onChange={(file) => onChange({ videoUnit1: file })}
          />

          <FileUpload
            label="Video Interface Unit 2"
            required
            file={formData.videoUnit2}
            onChange={(file) => onChange({ videoUnit2: file })}
          />

          <MultiFileUpload
            label="Optional Photos"
            files={formData.videoOptional}
            onChange={(files) => onChange({ videoOptional: files })}
            maxFiles={3}
          />
        </div>
      </div>
    </div>
  );
}
