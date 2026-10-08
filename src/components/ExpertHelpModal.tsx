import React from 'react';
import { UserCheck, Phone, MapPin, ExternalLink, ShieldCheck, Mail, X } from 'lucide-react';

interface ExpertHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpertHelpModal: React.FC<ExpertHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const experts = [
    {
      name: 'Dr. Sunita Deshmukh',
      role: 'Senior Plant Pathologist',
      institution: 'Regional Agricultural Extension Center',
      distance: '14 km away',
      phone: '+91 98221 00293',
      available: 'Mon - Fri (9 AM - 5 PM)',
      specialty: 'Solanaceous Blights, Fungal Resistance Diagnostics',
    },
    {
      name: 'Prof. Arvind Kulkarni',
      role: 'Crop Protection Specialist',
      institution: 'National Horticulture Research Institute',
      distance: '28 km away',
      phone: '+91 94230 88129',
      available: 'Tele-consultation Active',
      specialty: 'Integrated Pest Management (IPM), Biological Controls',
    },
    {
      name: 'Central Agri-Clinic & Soil Lab',
      role: 'Government Certified Diagnostic Facility',
      institution: 'District Krishi Vigyan Kendra (KVK)',
      distance: '9 km away',
      phone: '+91 91580 44210',
      available: 'Emergency Sample Drop-off',
      specialty: 'Microscopic Spore Identification & Tissue Testing',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200 animate-scaleUp">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Verified Agricultural Experts Near You
              </h3>
              <p className="text-xs text-neutral-400">
                Government-certified agronomists & regional diagnostic clinics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3.5 max-h-[460px] overflow-y-auto">
          {experts.map((exp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-neutral-200 hover:border-purple-300 hover:bg-neutral-50/70 transition-all space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                    <span>{exp.name}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </h4>
                  <p className="text-purple-900/80 font-medium">{exp.role} · {exp.institution}</p>
                </div>
                <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded self-start sm:self-center">
                  {exp.distance}
                </span>
              </div>

              <div className="text-neutral-600 leading-relaxed">
                Specialty: <strong>{exp.specialty}</strong>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-2 text-neutral-500">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-mono font-semibold text-neutral-800">{exp.phone}</span>
                  <span>({exp.available})</span>
                </div>

                <a
                  href={`tel:${exp.phone.replace(/\s+/g, '')}`}
                  className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Connect Now</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-neutral-50 rounded-xl text-neutral-500 text-[11px] text-center border border-neutral-200">
          Emergency Plant Clinic Hotline: <strong>1800-180-1551</strong> (Toll-Free Agricultural Support)
        </div>
      </div>
    </div>
  );
};
