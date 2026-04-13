import { useState, useEffect } from 'react';
import { useProperties } from './hooks/useProperties';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { FilterBar } from './components/FilterBar';
import { PropertyCard } from './components/PropertyCard';
import { AddPropertyModal } from './components/AddPropertyModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { Property, PropertyFilters } from './types/property';
import { Building2, RefreshCw } from 'lucide-react';

const defaultFilters: PropertyFilters = {
  type: '',
  transaction: '',
  prix_min: '',
  prix_max: '',
  localisation: '',
  statut_mandat: '',
};

export default function App() {
  const { properties, loading, error, fetchProperties, addProperty, updateProperty, deleteProperty } =
    useProperties();
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    fetchProperties(filters);
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Header onAddProperty={() => setShowAddModal(true)} totalCount={properties.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <StatsCards properties={properties} />

        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          resultCount={properties.length}
        />

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-[#2563eb]/20 border-t-[#2563eb] rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Chargement des biens...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium mb-3">{error}</p>
            <button
              onClick={() => fetchProperties(filters)}
              className="flex items-center gap-2 mx-auto text-sm text-red-600 hover:text-red-800 font-semibold border border-red-300 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw size={14} />
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="bg-[#0f2552]/5 rounded-2xl p-6">
              <Building2 size={48} className="text-[#0f2552]/30" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-gray-600">Aucun bien trouvé</p>
              <p className="text-sm text-gray-400 mt-1">
                Modifiez vos filtres ou ajoutez un nouveau bien
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#2563eb] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1d4ed8] transition-colors shadow-sm"
            >
              Ajouter un bien
            </button>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={(p) => setSelectedProperty(p)}
              />
            ))}
          </div>
        )}
      </main>

      {showAddModal && (
        <AddPropertyModal
          onClose={() => setShowAddModal(false)}
          onSubmit={addProperty}
        />
      )}

      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onUpdate={async (id, data) => {
            const success = await updateProperty(id, data);
            if (success) {
              const updated = properties.find((p) => p.id === id);
              if (updated) setSelectedProperty({ ...updated } as Property);
            }
            return success;
          }}
          onDelete={async (id) => {
            const success = await deleteProperty(id);
            if (success) setSelectedProperty(null);
            return success;
          }}
        />
      )}
    </div>
  );
}
