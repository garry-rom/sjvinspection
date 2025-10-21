import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { InspectionFormData, initialFormData } from './types';
import { Page1 } from './Page1';
import { Page2 } from './Page2';
import { Page3 } from './Page3';
import { ChevronLeft, ChevronRight, Save, Send } from 'lucide-react';

type Props = {
  onComplete: () => void;
};

export function InspectionForm({ onComplete }: Props) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<InspectionFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPages = 3;
  const progress = (currentPage / totalPages) * 100;

  const updateFormData = (data: Partial<InspectionFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}_${Date.now()}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('inspection-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('inspection-files')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const uploadFiles = async (files: File[], basePath: string): Promise<string[]> => {
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i], `${basePath}_${i}`);
      urls.push(url);
    }
    return urls;
  };

  const validatePage1 = () => {
    return (
      formData.engineerName &&
      formData.vesselName &&
      formData.location &&
      formData.inspectionDate &&
      formData.vdrMake &&
      formData.imoNumber &&
      formData.mmsiNumber
    );
  };

  const validatePage2 = () => {
    return (
      formData.dauDoorOpen &&
      formData.serialNumber &&
      formData.grounding &&
      formData.batteryPhoto &&
      formData.capsulePhoto &&
      formData.cableGland &&
      formData.beaconExpiry &&
      formData.floatFree &&
      formData.coverRemoved &&
      formData.junctionBox &&
      formData.hru &&
      formData.bcpDisplay &&
      formData.videoUnit1 &&
      formData.videoUnit2
    );
  };

  const validatePage3 = () => {
    return (
      formData.epirbReport &&
      formData.makerReport &&
      (formData.classReport || formData.className)
    );
  };

  const canProceed = () => {
    if (currentPage === 1) return validatePage1();
    if (currentPage === 2) return validatePage2();
    if (currentPage === 3) return validatePage3();
    return false;
  };

  const handleNext = () => {
    if (canProceed() && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (asDraft: boolean = false) => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const { data: inspection, error: inspectionError } = await supabase
        .from('inspections')
        .insert({
          user_id: user.id,
          engineer_name: formData.engineerName,
          vessel_name: formData.vesselName,
          location: formData.location,
          inspection_date: formData.inspectionDate,
          vdr_make: formData.vdrMake,
          imo_number: formData.imoNumber,
          mmsi_number: formData.mmsiNumber,
          status: asDraft ? 'draft' : 'submitted',
        })
        .select()
        .single();

      if (inspectionError) throw inspectionError;

      const dauDoorOpenUrl = formData.dauDoorOpen ? await uploadFile(formData.dauDoorOpen, 'dau_door') : '';
      const groundingUrl = formData.grounding ? await uploadFile(formData.grounding, 'grounding') : '';
      const batteryPhotoUrl = formData.batteryPhoto ? await uploadFile(formData.batteryPhoto, 'battery') : '';
      const dauOptionalUrls = await uploadFiles(formData.dauOptional, 'dau_optional');

      await supabase.from('dau_photos').insert({
        inspection_id: inspection.id,
        dau_door_open_url: dauDoorOpenUrl,
        serial_number: formData.serialNumber,
        grounding_url: groundingUrl,
        battery_photo_url: batteryPhotoUrl,
        optional_photos: dauOptionalUrls,
      });

      const capsulePhotoUrl = formData.capsulePhoto ? await uploadFile(formData.capsulePhoto, 'capsule') : '';
      const cableGlandUrl = formData.cableGland ? await uploadFile(formData.cableGland, 'cable_gland') : '';
      const beaconExpiryUrl = formData.beaconExpiry ? await uploadFile(formData.beaconExpiry, 'beacon') : '';
      const capsuleOptionalUrls = await uploadFiles(formData.capsuleOptional, 'capsule_optional');

      await supabase.from('fixed_capsule').insert({
        inspection_id: inspection.id,
        capsule_photo_url: capsulePhotoUrl,
        cable_gland_url: cableGlandUrl,
        beacon_expiry_url: beaconExpiryUrl,
        optional_photos: capsuleOptionalUrls,
      });

      const floatFreeUrl = formData.floatFree ? await uploadFile(formData.floatFree, 'float_free') : '';
      const coverRemovedUrl = formData.coverRemoved ? await uploadFile(formData.coverRemoved, 'cover') : '';
      const junctionBoxUrl = formData.junctionBox ? await uploadFile(formData.junctionBox, 'junction') : '';
      const hruUrl = formData.hru ? await uploadFile(formData.hru, 'hru') : '';
      const floatOptionalUrls = await uploadFiles(formData.floatOptional, 'float_optional');

      await supabase.from('float_free').insert({
        inspection_id: inspection.id,
        float_free_url: floatFreeUrl,
        cover_removed_url: coverRemovedUrl,
        junction_box_url: junctionBoxUrl,
        hru_url: hruUrl,
        optional_photos: floatOptionalUrls,
      });

      const bcpDisplayUrl = formData.bcpDisplay ? await uploadFile(formData.bcpDisplay, 'bcp') : '';
      const bcpOptionalUrls = await uploadFiles(formData.bcpOptional, 'bcp_optional');

      await supabase.from('bcp_display').insert({
        inspection_id: inspection.id,
        display_photo_url: bcpDisplayUrl,
        optional_photos: bcpOptionalUrls,
      });

      const videoUnit1Url = formData.videoUnit1 ? await uploadFile(formData.videoUnit1, 'video1') : '';
      const videoUnit2Url = formData.videoUnit2 ? await uploadFile(formData.videoUnit2, 'video2') : '';
      const videoOptionalUrls = await uploadFiles(formData.videoOptional, 'video_optional');

      await supabase.from('video_interface').insert({
        inspection_id: inspection.id,
        unit1_url: videoUnit1Url,
        unit2_url: videoUnit2Url,
        optional_photos: videoOptionalUrls,
      });

      const epirbReportUrl = formData.epirbReport ? await uploadFile(formData.epirbReport, 'epirb') : '';
      const makerReportUrl = formData.makerReport ? await uploadFile(formData.makerReport, 'maker') : '';
      const classReportUrl = formData.classReport ? await uploadFile(formData.classReport, 'class') : null;
      const previousCocUrls = await uploadFiles(formData.previousCoc, 'coc');

      await supabase.from('reports').insert({
        inspection_id: inspection.id,
        epirb_report_url: epirbReportUrl,
        maker_report_url: makerReportUrl,
        class_report_url: classReportUrl,
        class_name: formData.className || null,
        previous_coc_urls: previousCocUrls,
      });

      onComplete();
    } catch (err) {
      console.error('Error submitting inspection:', err);
      setError('Failed to submit inspection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">VDR Inspection Report</h1>
              <span className="text-sm font-medium text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-900 transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-right">{Math.round(progress)}% complete</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          {currentPage === 1 && <Page1 formData={formData} onChange={updateFormData} />}
          {currentPage === 2 && <Page2 formData={formData} onChange={updateFormData} />}
          {currentPage === 3 && <Page3 formData={formData} onChange={updateFormData} />}

          <div className="mt-8 flex items-center justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex items-center gap-3">
              {currentPage === totalPages && (
                <>
                  <button
                    type="button"
                    onClick={() => handleSubmit(true)}
                    disabled={loading || !canProceed()}
                    className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    Save Draft
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSubmit(false)}
                    disabled={loading || !canProceed()}
                    className="flex items-center gap-2 px-6 py-3 text-white bg-gray-900 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </>
              )}

              {currentPage < totalPages && (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-3 text-white bg-gray-900 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
