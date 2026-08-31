import React, { useState, useEffect } from 'react';
import { Briefcase, Edit3, Save, X, Copy, Check } from 'lucide-react';
import { JobPostingCopy } from '../types/sourcing';

interface JobPostingCardProps {
  jobPostingCopy: JobPostingCopy;
  onUpdate?: (data: JobPostingCopy) => void;
}

export const JobPostingCard: React.FC<JobPostingCardProps> = ({ jobPostingCopy, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<JobPostingCopy>(jobPostingCopy);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Handle graceful fallback if jobPostingCopy is undefined (old data in localstorage)
    if (jobPostingCopy) {
      setEditedData(jobPostingCopy);
    } else {
      setEditedData({
        naukri: { headline: '', keyTags: [], summary: '' },
        linkedIn: { hook: '', responsibilitiesAndRequirements: [] }
      });
    }
  }, [jobPostingCopy]);

  const handleSave = () => {
    if (onUpdate) {
      // Split tags by comma or newline if user edited them as a block string
      let cleanedData = { ...editedData };
      if (typeof cleanedData.naukri.keyTags === 'string') {
         cleanedData.naukri.keyTags = (cleanedData.naukri.keyTags as string).split('\n').filter(t => t.trim());
      }
      if (typeof cleanedData.linkedIn.responsibilitiesAndRequirements === 'string') {
         cleanedData.linkedIn.responsibilitiesAndRequirements = (cleanedData.linkedIn.responsibilitiesAndRequirements as string).split('\n').filter(t => t.trim());
      }
      onUpdate(cleanedData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(jobPostingCopy);
    setIsEditing(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Safe checks
  const data = isEditing ? editedData : jobPostingCopy;
  if (!data) return null;

  const naukriTagsText = Array.isArray(data.naukri?.keyTags) ? data.naukri.keyTags.join('\n') : (data.naukri?.keyTags || '');
  const linkedInReqsText = Array.isArray(data.linkedIn?.responsibilitiesAndRequirements) ? data.linkedIn.responsibilitiesAndRequirements.join('\n') : (data.linkedIn?.responsibilitiesAndRequirements || '');

  return (
    <div id="job-postings" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Optimized Job Posting Copy
            </h3>
          </div>
        </div>

        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCancel}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Naukri Posting */}
        <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-5 flex flex-col space-y-4 shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="font-extrabold text-amber-900 text-sm uppercase tracking-wider">
              Naukri.com Posting
            </div>
            {!isEditing && (
              <button
                onClick={() => copyToClipboard(`Title: ${data.naukri.headline}\n\nTags:\n${naukriTagsText}\n\nSummary:\n${data.naukri.summary}`, 'naukri')}
                className="text-slate-400 hover:text-blue-600"
              >
                {copiedId === 'naukri' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
          
          <div className="space-y-3 flex-1">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Headline</label>
              {!isEditing ? (
                <div className="font-semibold text-slate-800 bg-white p-3 rounded-lg border border-amber-100 shadow-2xs">
                  {data.naukri?.headline}
                </div>
              ) : (
                <input
                  type="text"
                  className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  value={data.naukri?.headline}
                  onChange={(e) => setEditedData({ ...editedData, naukri: { ...editedData.naukri, headline: e.target.value } })}
                />
              )}
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Key Tags (Resume Match)</label>
              {!isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(data.naukri?.keyTags) && data.naukri.keyTags.map((tag, i) => (
                    <span key={i} className="bg-white border border-amber-200 text-amber-800 text-xs px-2 py-1 rounded-md font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <textarea
                  className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                  value={naukriTagsText as string}
                  onChange={(e) => setEditedData({ ...editedData, naukri: { ...editedData.naukri, keyTags: e.target.value as any } })}
                  placeholder="One tag per line"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Summary (First 3 Lines)</label>
              {!isEditing ? (
                <div className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-amber-100 shadow-2xs">
                  {data.naukri?.summary}
                </div>
              ) : (
                <textarea
                  className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                  value={data.naukri?.summary}
                  onChange={(e) => setEditedData({ ...editedData, naukri: { ...editedData.naukri, summary: e.target.value } })}
                />
              )}
            </div>
          </div>
        </div>

        {/* LinkedIn Posting */}
        <div className="bg-blue-50/40 border border-blue-200 rounded-xl p-5 flex flex-col space-y-4 shadow-2xs relative">
          <div className="flex items-center justify-between">
            <div className="font-extrabold text-blue-900 text-sm uppercase tracking-wider">
              LinkedIn Job Description
            </div>
            {!isEditing && (
              <button
                onClick={() => copyToClipboard(`${data.linkedIn.hook}\n\nRequirements:\n${linkedInReqsText}`, 'linkedin')}
                className="text-slate-400 hover:text-blue-600"
              >
                {copiedId === 'linkedin' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>

          <div className="space-y-3 flex-1">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">The Hook</label>
              {!isEditing ? (
                <div className="font-medium text-slate-800 bg-white p-3 rounded-lg border border-blue-100 shadow-2xs italic">
                  "{data.linkedIn?.hook}"
                </div>
              ) : (
                <textarea
                  className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                  value={data.linkedIn?.hook}
                  onChange={(e) => setEditedData({ ...editedData, linkedIn: { ...editedData.linkedIn, hook: e.target.value } })}
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Responsibilities & Requirements</label>
              {!isEditing ? (
                <ul className="space-y-2 text-sm text-slate-700 font-medium">
                  {Array.isArray(data.linkedIn?.responsibilitiesAndRequirements) && data.linkedIn.responsibilitiesAndRequirements.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2 bg-white p-2 rounded border border-blue-50 shadow-2xs">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <textarea
                  className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 min-h-[150px]"
                  value={linkedInReqsText as string}
                  onChange={(e) => setEditedData({ ...editedData, linkedIn: { ...editedData.linkedIn, responsibilitiesAndRequirements: e.target.value as any } })}
                  placeholder="One requirement per line"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
