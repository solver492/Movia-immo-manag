import { Phone, MapPin, BedDouble, Car, Layers, ArrowUpDown } from 'lucide-react';
import { Property } from '../types/property';

interface PropertyCardProps {
  property: Property;
  onClick: (property: Property) => void;
}

const typeIcons: Record<string, string> = {
  Appartement: '🏢',
  Maison: '🏠',
  Villa: '🏡',
  Terrain: '🌿',
  'Local Commercial': '🏪',
};

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M MAD`;
  if (price >= 1_000) return `${(price / 1_000).toFixed(0)}K MAD`;
  return `${price.toLocaleString('fr-MA')} MAD`;
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  Actif: { label: 'Actif', classes: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  Vendu: { label: 'Vendu', classes: 'bg-gray-100 text-gray-500 border-gray-200' },
  Loué: { label: 'Loué', classes: 'bg-sky-100 text-sky-700 border-sky-200' },
  'En attente': { label: 'En attente', classes: 'bg-amber-100 text-amber-700 border-amber-200' },
};

const transactionConfig: Record<string, { classes: string }> = {
  'À vendre': { classes: 'bg-[#2563eb] text-white' },
  'À louer': { classes: 'bg-emerald-600 text-white' },
};

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const status = statusConfig[property.statut_mandat] ?? statusConfig['Actif'];
  const txConfig = transactionConfig[property.transaction] ?? transactionConfig['À vendre'];

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${property.contact_telephone}`;
  };

  return (
    <div
      onClick={() => onClick(property)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex-shrink-0">
        {property.photo_url ? (
          <img
            src={property.photo_url}
            alt={`${property.type} - ${property.localisation}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <span className="text-4xl">{typeIcons[property.type] ?? '🏠'}</span>
            <span className="text-xs text-slate-400 font-medium">{property.type}</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${txConfig.classes}`}>
            {property.transaction}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${status.classes}`}>
            {status.label}
          </span>
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="bg-[#0f2552]/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-sm">
            {property.id_bien}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{property.type}</p>
            <p className="text-lg font-bold text-[#0f2552] leading-tight">
              {formatPrice(property.prix)}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-semibold text-gray-700">{property.superficie} m²</p>
            {property.etat && (
              <p className="text-xs text-gray-400 mt-0.5">{property.etat}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <MapPin size={11} className="flex-shrink-0" />
          <span className="truncate">{property.localisation}</span>
        </div>

        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {property.nb_chambres !== null && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <BedDouble size={12} />
              <span>{property.nb_chambres} ch.</span>
            </div>
          )}
          {property.parking && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Car size={12} />
              <span>Parking</span>
            </div>
          )}
          {property.etage !== null && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Layers size={12} />
              <span>Ét. {property.etage}</span>
            </div>
          )}
          {property.ascenseur && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <ArrowUpDown size={12} />
              <span>Ascenseur</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-700 truncate">{property.contact_nom}</p>
            <p className="text-xs text-gray-400 truncate">{property.contact_telephone}</p>
          </div>
          <button
            onClick={handleCall}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors duration-150 flex-shrink-0 shadow-sm"
          >
            <Phone size={12} />
            Appeler
          </button>
        </div>
      </div>
    </div>
  );
}
