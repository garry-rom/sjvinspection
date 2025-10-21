export type InspectionFormData = {
  engineerName: string;
  vesselName: string;
  location: string;
  inspectionDate: string;
  vdrMake: 'NSR' | 'SALNAVIGATION' | 'NETWAVE' | 'HEADWAY' | '';
  imoNumber: string;
  mmsiNumber: string;
  dauDoorOpen: File | null;
  serialNumber: string;
  grounding: File | null;
  batteryPhoto: File | null;
  dauOptional: File[];
  capsulePhoto: File | null;
  cableGland: File | null;
  beaconExpiry: File | null;
  capsuleOptional: File[];
  floatFree: File | null;
  coverRemoved: File | null;
  junctionBox: File | null;
  hru: File | null;
  floatOptional: File[];
  bcpDisplay: File | null;
  bcpOptional: File[];
  videoUnit1: File | null;
  videoUnit2: File | null;
  videoOptional: File[];
  epirbReport: File | null;
  makerReport: File | null;
  classReport: File | null;
  className: string;
  previousCoc: File[];
};

export const initialFormData: InspectionFormData = {
  engineerName: '',
  vesselName: '',
  location: '',
  inspectionDate: new Date().toISOString().slice(0, 16),
  vdrMake: '',
  imoNumber: '',
  mmsiNumber: '',
  dauDoorOpen: null,
  serialNumber: '',
  grounding: null,
  batteryPhoto: null,
  dauOptional: [],
  capsulePhoto: null,
  cableGland: null,
  beaconExpiry: null,
  capsuleOptional: [],
  floatFree: null,
  coverRemoved: null,
  junctionBox: null,
  hru: null,
  floatOptional: [],
  bcpDisplay: null,
  bcpOptional: [],
  videoUnit1: null,
  videoUnit2: null,
  videoOptional: [],
  epirbReport: null,
  makerReport: null,
  classReport: null,
  className: '',
  previousCoc: [],
};
