import { useState } from 'react';
import { X, Phone, MapPin, BedDouble, Car, Layers, ArrowUpDown, CreditCard as Edit3, Trash2, CheckCircle, Save } from 'lucide-react';
import {
  Property, PropertyFormData, PROPERTY_TYPES, TRANSACTION_TYPES,
  PROPERTY_STATES, MANDAT_STATUSES, MOROCCAN_CITIES
} from '../types/property';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<PropertyFormData>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

function formatPrice(price: number): string {
  return price.toLocaleString('fr-MA') + ' MAD';
}

const statusConfig: Record<string, { classes: string }> = {
  Actif: { classes: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  Vendu: { classes: 'bg-gray-100 text-gray-500 border-gray-200' },
  Loué: { classes: 'bg-sky-100 text-sky-700 border-sky-200' },
  'En attente': { classes: 'bg-amber-100 text-amber-700 border-amber-200' },
};

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent bg-gray-50';
const selectClass = inputClass;

export function PropertyDetailModal({ property, onClose, onUpdate, onDelete }: PropertyDetailModalProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [form, setForm] = useState<PropertyFormData>({
    type: property.type,
    transaction: property.transaction,
    prix: property.prix.toString(),
    superficie: property.superficie.toString(),
    nb_chambres: property.nb_chambres?.toString() ?? '',
    parking: property.parking,
    etage: property.etage?.toString() ?? '',
    ascenseur: property.ascenseur,
    etat: property.etat ?? '',
    localisation: property.localisation,
    contact_nom: property.contact_nom,
    contact_telephone: property.contact_telephone,
    statut_mandat: property.statut_mandat,
    photo_url: property.photo_url ?? '',
  });

  const set = (key: keyof PropertyFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await onUpdate(property.id, form);
    setSaving(false);
    if (success) setEditing(false);
  };

  const handleDelete = async () => {
    const success = await onDelete(property.id);
    if (success) onClose();
  };

  const status = statusConfig[property.statut_mandat] ?? statusConfig['Actif'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-[#0f2552] text-white px-2 py-0.5 rounded">
              {property.id_bien}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${status.classes}`}>
              {property.statut_mandat}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="p-2 rounded-lg hover:bg-blue-50 text-[#2563eb] transition-colors"
                title="Modifier"
              >
                <Edit3 size={16} />
              </button>
            )}
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-xs text-red-500 font-medium">Confirmer ?</span>
                <button onClick={handleDelete} className="text-xs bg-red-500 text-white px-2 py-1 rounded font-semibold">Oui</button>
                <button onClick={() => setConfirmDelete(false)} className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded font-semibold">Non</button>
              </div>
            )}
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {property.photo_url && (
            <div className="h-48 overflow-hidden flex-shrink-0">
              <img
                src={property.photo_url}
                alt={property.type}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
              />
            </div>
          )}

          <div className="px-5 py-4">
            {!editing ? (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{property.type}</p>
                    <p className="text-2xl font-bold text-[#0f2552]">{formatPrice(property.prix)}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{property.superficie} m²</p>
                  </div>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    property.transaction === 'À vendre' ? 'bg-[#2563eb] text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {property.transaction}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-4">
                  <MapPin size={14} className="text-gray-400" />
                  <span>{property.localisation}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {property.nb_chambres !== null && (
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                      <BedDouble size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Chambres</p>
                        <p className="text-sm font-semibold text-gray-700">{property.nb_chambres}</p>
                      </div>
                    </div>
                  )}
                  {property.etage !== null && (
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                      <Layers size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Étage</p>
                        <p className="text-sm font-semibold text-gray-700">{property.etage}</p>
                      </div>
                    </div>
                  )}
                  {property.parking && (
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                      <Car size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Parking</p>
                        <p className="text-sm font-semibold text-gray-700">Inclus</p>
                      </div>
                    </div>
                  )}
                  {property.ascenseur && (
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                      <ArrowUpDown size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Ascenseur</p>
                        <p className="text-sm font-semibold text-gray-700">Disponible</p>
                      </div>
                    </div>
                  )}
                  {property.etat && (
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                      <CheckCircle size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">État</p>
                        <p className="text-sm font-semibold text-gray-700">{property.etat}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-[#0f2552]/5 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-[#0f2552] uppercase tracking-wide mb-2">Contact propriétaire</p>
                  <p className="text-sm font-semibold text-gray-800">{property.contact_nom}</p>
                  <p className="text-sm text-gray-500">{property.contact_telephone}</p>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
                    <select value={form.type} onChange={(e) => set('type', e.target.value)} className={selectClass}>
                      {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Transaction</label>
                    <select value={form.transaction} onChange={(e) => set('transaction', e.target.value)} className={selectClass}>
                      {TRANSACTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Prix (MAD)</label>
                    <input type="number" value={form.prix} onChange={(e) => set('prix', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Superficie (m²)</label>
                    <input type="number" value={form.superficie} onChange={(e) => set('superficie', e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Nb. chambres</label>
                    <input type="number" value={form.nb_chambres} onChange={(e) => set('nb_chambres', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Étage</label>
                    <input type="number" value={form.etage} onChange={(e) => set('etage', e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">État</label>
                    <select value={form.etat} onChange={(e) => set('etat', e.target.value)} className={selectClass}>
                      <option value="">--</option>
                      {PROPERTY_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Statut mandat</label>
                    <select value={form.statut_mandat} onChange={(e) => set('statut_mandat', e.target.value)} className={selectClass}>
                      {MANDAT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Localisation</label>
                  <input list="cities-detail" value={form.localisation} onChange={(e) => set('localisation', e.target.value)} className={inputClass} />
                  <datalist id="cities-detail">
                    {MOROCCAN_CITIES.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 cursor-pointer">
                    <input type="checkbox" checked={form.parking} onChange={(e) => set('parking', e.target.checked)} className="accent-[#2563eb]" />
                    <span className="text-sm text-gray-700">Parking</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 cursor-pointer">
                    <input type="checkbox" checked={form.ascenseur} onChange={(e) => set('ascenseur', e.target.checked)} className="accent-[#2563eb]" />
                    <span className="text-sm text-gray-700">Ascenseur</span>
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Contact nom</label>
                  <input type="text" value={form.contact_nom} onChange={(e) => set('contact_nom', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Téléphone</label>
                  <input type="tel" value={form.contact_telephone} onChange={(e) => set('contact_telephone', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">URL Photo</label>
                  <input type="url" value={form.photo_url} onChange={(e) => set('photo_url', e.target.value)} className={inputClass} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
          {!editing ? (
            <a
              href={`tel:${property.contact_telephone}`}
              className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
            >
              <Phone size={16} />
              Appeler {property.contact_nom}
            </a>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-xl transition-colors shadow-sm"
              >
                <Save size={14} />
                {saving ? 'Enregistrement...' : 'Sauvegarder'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
