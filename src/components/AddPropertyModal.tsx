import { useState } from 'react';
import { X } from 'lucide-react';
import {
  PropertyFormData,
  PROPERTY_TYPES,
  TRANSACTION_TYPES,
  PROPERTY_STATES,
  MANDAT_STATUSES,
  MOROCCAN_CITIES,
} from '../types/property';

interface AddPropertyModalProps {
  onClose: () => void;
  onSubmit: (data: PropertyFormData) => Promise<boolean>;
}

const defaultForm: PropertyFormData = {
  type: 'Appartement',
  transaction: 'À vendre',
  prix: '',
  superficie: '',
  nb_chambres: '',
  parking: false,
  etage: '',
  ascenseur: false,
  etat: '',
  localisation: '',
  contact_nom: '',
  contact_telephone: '',
  statut_mandat: 'Actif',
  photo_url: '',
};

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-[#0f2552] uppercase tracking-widest mb-3 pb-2 border-b border-gray-100">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, required, children }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent bg-gray-50 placeholder-gray-400';
const selectClass = inputClass;

export function AddPropertyModal({ onClose, onSubmit }: AddPropertyModalProps) {
  const [form, setForm] = useState<PropertyFormData>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof PropertyFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.prix || !form.superficie || !form.localisation || !form.contact_nom || !form.contact_telephone) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setSubmitting(true);
    setError(null);
    const success = await onSubmit(form);
    setSubmitting(false);
    if (success) {
      onClose();
    } else {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#0f2552]">Nouveau bien</h2>
            <p className="text-xs text-gray-400 mt-0.5">Remplissez les informations du bien</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4">
          <FormSection title="Informations générales">
            <FormRow>
              <Field label="Type de bien" required>
                <select value={form.type} onChange={(e) => set('type', e.target.value)} className={selectClass}>
                  {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Transaction" required>
                <select value={form.transaction} onChange={(e) => set('transaction', e.target.value)} className={selectClass}>
                  {TRANSACTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </FormRow>
            <FormRow>
              <Field label="Prix (MAD)" required>
                <input
                  type="number"
                  value={form.prix}
                  onChange={(e) => set('prix', e.target.value)}
                  placeholder="Ex: 1500000"
                  className={inputClass}
                  min="0"
                />
              </Field>
              <Field label="Superficie (m²)" required>
                <input
                  type="number"
                  value={form.superficie}
                  onChange={(e) => set('superficie', e.target.value)}
                  placeholder="Ex: 120"
                  className={inputClass}
                  min="0"
                />
              </Field>
            </FormRow>
            <FormRow>
              <Field label="État">
                <select value={form.etat} onChange={(e) => set('etat', e.target.value)} className={selectClass}>
                  <option value="">-- Sélectionner --</option>
                  {PROPERTY_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Statut mandat" required>
                <select value={form.statut_mandat} onChange={(e) => set('statut_mandat', e.target.value)} className={selectClass}>
                  {MANDAT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </FormRow>
            <Field label="Localisation" required>
              <input
                list="cities"
                value={form.localisation}
                onChange={(e) => set('localisation', e.target.value)}
                placeholder="Ville ou région"
                className={inputClass}
              />
              <datalist id="cities">
                {MOROCCAN_CITIES.map((c) => <option key={c} value={c} />)}
              </datalist>
            </Field>
          </FormSection>

          <FormSection title="Détails du bien">
            <FormRow>
              <Field label="Nb. chambres">
                <input
                  type="number"
                  value={form.nb_chambres}
                  onChange={(e) => set('nb_chambres', e.target.value)}
                  placeholder="Ex: 3"
                  className={inputClass}
                  min="0"
                />
              </Field>
              <Field label="Étage">
                <input
                  type="number"
                  value={form.etage}
                  onChange={(e) => set('etage', e.target.value)}
                  placeholder="Ex: 2"
                  className={inputClass}
                  min="0"
                />
              </Field>
            </FormRow>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={form.parking}
                  onChange={(e) => set('parking', e.target.checked)}
                  className="w-4 h-4 rounded accent-[#2563eb]"
                />
                <span className="text-sm font-medium text-gray-700">Parking</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={form.ascenseur}
                  onChange={(e) => set('ascenseur', e.target.checked)}
                  className="w-4 h-4 rounded accent-[#2563eb]"
                />
                <span className="text-sm font-medium text-gray-700">Ascenseur</span>
              </label>
            </div>
            <Field label="URL Photo">
              <input
                type="url"
                value={form.photo_url}
                onChange={(e) => set('photo_url', e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </Field>
          </FormSection>

          <FormSection title="Contact propriétaire">
            <Field label="Nom complet" required>
              <input
                type="text"
                value={form.contact_nom}
                onChange={(e) => set('contact_nom', e.target.value)}
                placeholder="Prénom Nom"
                className={inputClass}
              />
            </Field>
            <Field label="Téléphone" required>
              <input
                type="tel"
                value={form.contact_telephone}
                onChange={(e) => set('contact_telephone', e.target.value)}
                placeholder="+212 6XX XXX XXX"
                className={inputClass}
              />
            </Field>
          </FormSection>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}
        </form>

        <div className="px-5 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-xl transition-colors shadow-sm"
          >
            {submitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}
