import React from 'react';
import { InspectionFormData } from './types';

type Props = {
  formData: InspectionFormData;
  onChange: (data: Partial<InspectionFormData>) => void;
};

const VDR_MAKES = ['NSR', 'SALNAVIGATION', 'NETWAVE', 'HEADWAY'] as const;

export function Page1({ formData, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="engineerName" className="block text-sm font-medium text-gray-700 mb-2">
              Engineer Name <span className="text-red-500">*</span>
            </label>
            <input
              id="engineerName"
              type="text"
              value={formData.engineerName}
              onChange={(e) => onChange({ engineerName: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              placeholder="Enter engineer name"
            />
          </div>

          <div>
            <label htmlFor="vesselName" className="block text-sm font-medium text-gray-700 mb-2">
              Vessel Name <span className="text-red-500">*</span>
            </label>
            <input
              id="vesselName"
              type="text"
              value={formData.vesselName}
              onChange={(e) => onChange({ vesselName: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              placeholder="Enter vessel name"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => onChange({ location: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              placeholder="Enter location"
            />
          </div>

          <div>
            <label htmlFor="inspectionDate" className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              id="inspectionDate"
              type="datetime-local"
              value={formData.inspectionDate}
              onChange={(e) => onChange({ inspectionDate: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="vdrMake" className="block text-sm font-medium text-gray-700 mb-2">
              VDR Make <span className="text-red-500">*</span>
            </label>
            <select
              id="vdrMake"
              value={formData.vdrMake}
              onChange={(e) => onChange({ vdrMake: e.target.value as any })}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
            >
              <option value="">Select VDR Make</option>
              {VDR_MAKES.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="imoNumber" className="block text-sm font-medium text-gray-700 mb-2">
              IMO Number <span className="text-red-500">*</span>
            </label>
            <input
              id="imoNumber"
              type="text"
              value={formData.imoNumber}
              onChange={(e) => onChange({ imoNumber: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              placeholder="Enter IMO number"
            />
          </div>

          <div>
            <label htmlFor="mmsiNumber" className="block text-sm font-medium text-gray-700 mb-2">
              MMSI Number <span className="text-red-500">*</span>
            </label>
            <input
              id="mmsiNumber"
              type="text"
              value={formData.mmsiNumber}
              onChange={(e) => onChange({ mmsiNumber: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              placeholder="Enter MMSI number"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
